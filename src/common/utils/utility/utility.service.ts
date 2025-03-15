import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilityService {
  generateUuid(): string {
    return uuidv4();
  }

  getCurrentISODate(): string {
    return new Date().toISOString();
  }

  getReservationCode(): string {
    let code = '';
    let date = new Date();
    code = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
    return code;
  }

  convertToUTCISODateString(dateString: string): string {
    const formats = [
      'M/d/yyyy HH:mm:ss',
      'MM/dd/yyyy HH:mm:ss',
      'yyyy-MM-dd HH:mm:ss',
      'dd-MM-yyyy HH:mm:ss',
      'yyyy/MM/dd HH:mm:ss',
      'd/M/yyyy HH:mm:ss',
      'dd/MM/yyyy HH:mm:ss',
      'M-d-yyyy HH:mm:ss',
    ];

    // parsing with each format
    let parsedValidDate;
    for (const format of formats) {
      let parsedDate = DateTime.fromFormat(dateString, format, {
        zone: 'local',
      });
      if (parsedDate.isValid) {
        parsedValidDate = parsedDate;
        break;
      }
    }
    if (parsedValidDate)
      return parsedValidDate.toUTC().toISO(); // Convert to UTC ISO string
    else {
      console.error(`Invalid date format : ${dateString}`);
      return null;
    }
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust this value for security
    const salt = await bcrypt.genSalt(saltRounds); // Generate a dynamic salt
    return await bcrypt.hash(password, salt); // Hash the password with the dynamic salt
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword); // Compare the plaintext password with the hashed password
  }
}
