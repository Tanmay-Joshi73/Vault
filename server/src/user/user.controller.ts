import { Controller, Inject } from '@nestjs/common';
import { Body,Post,Get } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { User,UserSchema } from './Schemas/user.schema';
import { Vault,VaultSchema } from './Schemas/vault.schema';
import { VaultEntry } from './Schemas/vault.schema';
import { UserService } from './user.service';
import { vaultData } from 'src/auth/DTOs/vaultData.dto';
@Controller('user')
export class UserController {
    constructor(private readonly UserVault:UserService){}

@Get('/getVaultData')
async getData():Promise<void>{
    console.log("Inside the Outer Function")
const userData=this.UserVault.findVaultEntry();
return userData;
}

@Post('/AddvaultData')
async AddData(@Body() VaultInfO:vaultData):Promise<void>{
    const response=this.UserVault.AddEntry(VaultInfO);
    return;
}

}
