import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { PdfGeneratorService } from './pdf/pdf-generator.service';
import { AgentService } from './core-system/agent.service';
import { UserService } from './core-system/user.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as https from 'https';  // Import https from Node.js


@Module({
  imports: [HttpModule.register({
    // Disable SSL certificate validation (not recommended for production)
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate validation
    }),
  }),
    ConfigModule],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, PdfGeneratorService, AgentService, UserService],
})
export class AppModule { }
