import { IsString,isBoolean, isString } from "class-validator";
import { Types } from "mongoose";
export class vaultData{
@IsString()
username:string
@IsString()
website:string
@IsString()
encryptedPassword:string
@IsString()
folder:string
@IsString()
email:string
}