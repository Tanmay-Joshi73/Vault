import { Controller, Delete, Inject,Param } from '@nestjs/common';
import { Body,Post,Get } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { User,UserSchema } from './Schemas/user.schema';
import { Vault,VaultSchema } from './Schemas/vault.schema';
import { VaultEntry } from './Schemas/vault.schema';
import { UserService } from './user.service';
import { vaultData } from 'src/auth/DTOs/vaultData.dto';
import { log } from 'node:console';
import { Query } from '@nestjs/common';
export interface DelData{
    email: string;
  credentialId: string;
}

@Controller('user')

export class UserController {
    constructor(private readonly UserVault:UserService){}

@Get('/getVaultData/:Email')
async getData(@Query('Email') Email:string):Promise<void>{
;

// return;
const userData=this.UserVault.findVaultEntry(Email);
console.log(userData)
return userData;
}

@Post('/AddvaultData')
async AddData(@Body() VaultInfO:vaultData):Promise<void>{
    console.log(VaultInfO)
    const response=this.UserVault.AddEntry(VaultInfO);
    return;
}
@Delete('/DeletevaultData')
async DeleteData(@Body() DT:DelData):Promise<{Success:boolean}>{
    const response=this.UserVault.DeleteEntry(DT);
    return {Success:true}
}
}
