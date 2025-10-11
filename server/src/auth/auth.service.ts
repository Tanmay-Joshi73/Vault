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
 
    // console.log('user id is ',id)
    await user.save();     // this will create the user in the Database;
    return {
            Message:"Successsful",
            Status:true,
            StatusCode:202,
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

    // ------------------- LOGIN -------------------
  async Login(Data: { email: string; masterPassword: string }): Promise<SignUpResponce> {
    
    const {email,masterPassword}={...Data}
    console.log(masterPassword)
    // return ;
    
    // return; 
    // 1️⃣ Find user by email
    const user = await this.userModel.findOne({ email });
  
    if (!user) {
      return {
        Message: "Invalid email or password",
        Status: false,
        StatusCode: 401,
      };
    }

    // 2️⃣ Compare encrypted passwords directly
    if (user.password !== masterPassword) {
      return {
        Message: "Invalid email or password",
        Status: false,
        StatusCode: 401,
      };
    }

    // 3️⃣ Login successful
    return {
      Message: "Login Successful",
      Status: true,
      StatusCode: 200,
   
    };
  }

  async GetAll():Promise<any>{
    try{
        const users=await this .userModel.find();
        return users;
  }
  catch(err){
    console.log(err);

  }
}
}

