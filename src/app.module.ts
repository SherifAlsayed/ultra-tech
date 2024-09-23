import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { PdfGeneratorService } from './pdf/pdf-generator.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, PdfGeneratorService],
})
export class AppModule { }
