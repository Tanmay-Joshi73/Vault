import {  IsEmail,isString } from "class-validator"
import { IsString } from "class-validator"
export class Signup{
    @IsEmail()
    email:string
    @IsString()
    password:string
}