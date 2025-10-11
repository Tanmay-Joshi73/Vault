import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './Schemas/user.schema';
import { Vault,VaultEntry,VaultSchema } from './Schemas/vault.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports:[
    MongooseModule.forFeature([{name:Vault.name,schema:VaultSchema}]),
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
    // MongooseModule.forFeature([{name:VaultEntry.name,schema:VaultSchema}]),

  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
