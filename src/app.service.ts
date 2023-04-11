import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto, UserDao } from '../dao/user.dao';
import { ScheduleDao } from 'dao/schedule.dao';
import { User } from 'schemas/userModel';
import { Schedule } from 'schemas/ScheduleModel';
import { EventsDao } from 'dao/events.dao';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { CreateEventDto, GetTokenDto, ScheduleDto } from 'dao/dto';

@Injectable()
export class AppService {
  private oauth2Client;
  constructor(private configService: ConfigService) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get<string>('client_id'),
      this.configService.get<string>('client_secret'),
      this.configService.get<string>('redirect_uri'),
    );
  }
  @Inject()
  private userDao: UserDao;

  @Inject()
  private eventsDao: EventsDao;

  @Inject()
  private scheduleDao: ScheduleDao;

  async getTokens(getTokenDto: GetTokenDto) {
    try {
      const { tokens } = await this.oauth2Client.getToken(getTokenDto.code);
      return tokens;
    } catch (e) {
      console.log(e);
    }
  }
  async createActalEvent(createEventDto: any) {
    try {
      const { scheduleId, organiserId, endTime, startTime, guestEmail, day } =
        createEventDto;

      this.oauth2Client.setCredentials({
        access_token: this.configService.get<string>('access_token'),
      });
      const calendar = google.calendar({
        version: 'v3',
        auth: this.oauth2Client,
      });
      let user;
      try {
        user = await this.userDao.getUserById(organiserId);
      } catch (e) {
        throw new NotFoundException(
          `Organiser with ID ${organiserId} not found`,
        );
      }
      const schedule = await this.scheduleDao.getSchedule({ _id: scheduleId });
      if (!schedule) {
        throw new NotFoundException(
          `Organiser is not available during this slot`,
        );
      }
      if (startTime < schedule.start || endTime > schedule.end) {
        throw new BadRequestException(
          'Your event is not falling in organiser schedule',
        );
      }
      const query = {
        organiserId,
        day: { $eq: day },
        startTime: { $gt: startTime },
        endTime: { $lt: endTime },
      };
      const organiserEventsClash = await this.eventsDao.findEvent(query);
      if (organiserEventsClash) {
        throw new BadRequestException(
          'Sorry this Slot is Booked by some other user',
        );
      }
      delete query.organiserId;
      query['guestEmail'] = guestEmail;
      const isGuestSlotBooked = await this.eventsDao.findEvent(query);
      if (isGuestSlotBooked) {
        throw new BadRequestException('You have already meeting in this slot');
      }

      const event = {
        summary: '',
        description: '',
        start: {
          dateTime: startTime,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: endTime,
          timeZone: 'America/Los_Angeles',
        },
        attendees: [{ email: user.email }, { email: guestEmail }],
      };

      try {
        const res = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });
        console.log(`Event created: ${res.data.htmlLink}`);
        const eventResponse = await this.eventsDao.create(createEventDto);
        const updatedEvents = [...(user?.events || []), eventResponse._id];
        await this.userDao.updateUser(user._id, {
          scheduleId: updatedEvents,
        });
        return eventResponse;
      } catch (err) {
        console.error(`Error: ${err}`);
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw e;
    }
  }

  async generateAuthUrl() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
    return authUrl;
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    return await this.userDao.create(createUserDto);
  }

  async getUserById(userId: string): Promise<User> {
    return await this.userDao.getUserById(userId);
  }

  async createSchedule(createScheduleDto: ScheduleDto): Promise<any> {
    const { userId, day } = createScheduleDto;
    const user = await this.userDao.getUserById(userId);
    const schedule = await this.scheduleDao.getSchedule({ userId, day });

    if (schedule) {
      throw new ForbiddenException('Schedule already exists');
    }

    const scheduleResp = await this.scheduleDao.create(createScheduleDto);
    const updatedSchedules = [...(user?.scheduleId || []), scheduleResp._id];
    const updatedUser = await this.userDao.updateUser(userId, {
      scheduleId: updatedSchedules,
    });

    return updatedUser;
  }

  async getUserSchedules(userId: string): Promise<Schedule[]> {
    return await this.scheduleDao.getSchedules(userId);
  }

  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios({
        method: 'post',
        url: 'https://oauth2.googleapis.com/token',
        data: {
          grant_type: 'refresh_token',
          client_id: this.configService.get<string>('client_id'),
          client_secret: this.configService.get<string>('client_secret'),
          refresh_token: refreshToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.error(error);
      throw new Error('Error refreshing access token');
    }
  }
}
