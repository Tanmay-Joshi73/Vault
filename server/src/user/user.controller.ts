import { Controller, Delete, Inject,Param, Patch } from '@nestjs/common';
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
export interface Updata{
  
  id?: string;                // optional — only present during update
  email: string;              // user email to identify whose vault it belongs to
  encryptedUsername: string;           // decrypted or encrypted username
  encryptedWebsite: string;            // website name (e.g., Goku)
  encryptedUrl: string;                // actual URL (e.g., https://Goku)
  encryptedPassword: string;           // encrypted or masked password
  encryptedFolder: string;             // folder name (e.g., Work, Personal)
  notes: string;              // optional user notes
  createdAt?: string;         // optional timestamps (from backend)
  updatedAt?: string;         // optional timestamps (from backend)


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
async AddData(@Body() VaultInfO:vaultData):Promise<any>{
    
    const response=await this.UserVault.AddEntry(VaultInfO);
    
     return {
  success: true,
  data: {
    vault: response
  }
};
}
@Patch('/updateData')
async EditData(@Body() VaultInfO:Updata):Promise<void>{
  const response=await this.UserVault.update(VaultInfO) 

}
@Delete('/DeletevaultData')
async DeleteData(@Body() DT:DelData):Promise<{success:boolean}>{
    const response=await this.UserVault.DeleteEntry(DT);
    return {success:true}
}
}
