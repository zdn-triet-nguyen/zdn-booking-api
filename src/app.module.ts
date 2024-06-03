import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { SportFieldModule } from './sport-field/sport-field.module';
import { FieldModule } from './field/field.module';
import { BookingModule } from './booking/booking.module';
import { LocationModule } from './location/location.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    UserModule,
    AccountModule,
    SportFieldModule,
    FieldModule,
    BookingModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
