import { Bucket } from '@google-cloud/storage';
import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { BaseResponse } from 'src/common/response/base.response';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseService {
  private bucket: Bucket;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {
    this.bucket = this.firebaseApp.storage().bucket();
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<BaseResponse> {
    const uuid = uuidv4();
    const fileRef = this.bucket.file(`${folder}/${uuid}${file.originalname}`);
    const blobStream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => reject(error));
      blobStream.on('finish', () => {
        fileRef
          .makePublic()
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileRef.name}`;
            resolve(
              new BaseResponse(
                [publicUrl],
                'File uploaded successfully',
                200,
                new Date().toISOString(),
              ),
            );
          })
          .catch(reject);
      });
      blobStream.end(file.buffer);
    });
  }
}
