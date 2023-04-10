import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UserDao } from '../dao/user.dao';
import { ScheduleDao } from 'dao/schedule.dao';
import { User } from 'schemas/userModel';
import { Schedule } from 'schemas/ScheduleModel';
import { EventsDao } from 'dao/events.dao';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
const client_id =
  '1096141029453-pqpr399re6fcr4c3f79ffebkmh4i8jb3.apps.googleusercontent.com';
const client_secret = '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';
const redirect_uri = 'http://0.0.0.0:3000/eventCreds';
const oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

@Injectable()
export class AppService {
  @Inject()
  private userDao: UserDao;

  @Inject()
  private eventsDao: EventsDao;

  @Inject()
  private scheduleDao: ScheduleDao;

  async createEvent(createEventDto) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
    return authUrl;
    const code = 'authorization_code';
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens, 'generated------------->');
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const { scheduleId, organiserId } = createEventDto;
    await this.userDao.getUserById(organiserId);
    const schedule = await this.scheduleDao.getSchedule({ _id: scheduleId });
    if (!schedule) {
      throw new NotFoundException(`schedule with ID ${scheduleId} not found`);
    }

    const event = {
      summary: 'Appointment',
      location: 'Somewhere',
      description: 'Appointment Description',
      start: {
        dateTime: '2023-04-10T09:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: '2023-04-10T10:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      attendees: [
        { email: 'balajiab09@gmail.com' },
        { email: 'gopalbharadva@gmail.com' },
      ],
    };

    // Insert the event into the primary calendar
    calendar.events.insert(
      {
        calendarId: 'primary',
        requestBody: event,
      },
      (err, res) => {
        if (err) {
          console.error(`Error: ${err}`);
          return;
        }
        console.log(`Event created: ${res.data.htmlLink}`);
      },
    );

    // return await this.eventsDao.create(createEventDto);
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    return await this.userDao.create(createUserDto);
  }

  async getUserById(userId: string): Promise<User> {
    return await this.userDao.getUserById(userId);
  }

  async createSchedule(createScheduleDto: any): Promise<any> {
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
}
