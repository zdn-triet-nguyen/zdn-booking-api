/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Get,
  Request,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../services/firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private firebaseService: FirebaseService) {}

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    console.log('file', file);
    const res = await this.firebaseService.uploadFile(file, 'avatars');
    return res;
  }

  // @Post('upload-avatar')
  // async uploadFile(@Request() file: any) {
  //   console.log('file', file);
  //   return file.body;
  // }
}
