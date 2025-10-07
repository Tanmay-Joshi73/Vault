import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from 'src/user/Schemas/user.schema';
import { User } from 'src/user/Schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}])
  ]  ,
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
