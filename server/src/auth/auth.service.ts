import { Injectable } from '@nestjs/common';
import { User,UserSchema } from 'src/user/Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Signup } from './DTOs/Signup.dto';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { SignUpResponce } from './AuthTypes/Auth';
/////This service will handle everything about Authentication
@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async SignUP(Data:Signup):Promise<SignUpResponce>{
    const {email,password}=Data;
    const ExistingUser=await this.CheckEmail(email);
    if(ExistingUser){
        return {
            Message:"Email is already registared",
            Status:false,
            StatusCode:409
        }
        
    }
    const user= new this.userModel({email:email,password:password})
    await user.save();     // this will create the user in the Database;
    return {
            Message:"Successsful",
            Status:true,
            StatusCode:202
             }
  }
  async CheckEmail(email:string):Promise<boolean>{
        try{
        const ExistingUser=await this.userModel.findOne({email:email})
        console.log("User->",ExistingUser)
        if(ExistingUser){
            return true;
        } 
            
        }
        catch(err){
            console.log(err)
        }
        return false;
  }
}