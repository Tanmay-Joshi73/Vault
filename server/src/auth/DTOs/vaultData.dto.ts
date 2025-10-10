import { IsString,isBoolean } from "class-validator";
export class vaultData{
@IsString()
username:string
@IsString()
url:string
@IsString()
password:string
}