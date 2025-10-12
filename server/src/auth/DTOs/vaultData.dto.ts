import { IsString,isBoolean, isString } from "class-validator";
import { Types } from "mongoose";
export class vaultData{
@IsString()
encryptedUsername:string
@IsString()
encryptedWebsite:string
@IsString()
encryptedPassword:string
@IsString()
encryptedFolder:string
@IsString()
email:string
}