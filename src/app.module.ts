import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [],
  controllers: [AppController,AuthController,UserController],
  providers: [AppService],
})
export class AppModule {}
