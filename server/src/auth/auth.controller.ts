import { Controller } from '@nestjs/common';
import { Get,Body,Post} from '@nestjs/common';
import  {Auth} from './DTOs/auth.dto';
import { SignUp,SignUpResponce } from './AuthTypes/Auth';;
import { vaultData } from './DTOs/vaultData.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/Schemas/user.schema';
import { Model} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker'
import { log } from 'node:console';
import { Performance } from 'node:perf_hooks';

@Controller('auth')
export class AuthController {
    constructor(private readonly Auth:AuthService,
      @InjectModel(User.name)private readonly UserInfo:Model<User>
    ){}
@Post('/SignUp')
async Show(@Body() FormData:Auth):Promise<any>{
 
 const {email,masterPassword : password} ={...FormData}
 const UserData:SignUp={
    email:email,
    password:password
 }
    
    const result=await this.Auth.SignUP(UserData)
    return result; /// this will contain the actual result of the query
}

 @Post('/Login')
  async login(@Body() formData: { email: string; masterPassword: string }) {
    const response=await this.Auth.Login(formData);
    return response;
  }
  @Get('/FindAll')
  async GetAll():Promise<any>{

  
    console.log("Hey i am inside the FindAll Route")
    return this.Auth.GetAll();
  }
  @Get('/Checker')
  async Checkit():Promise<any>{
    const email:string='RandomEmail';
    const check:any={}
    console.log("Removing the index");
    try{
   await  this.UserInfo.collection.dropIndex('email_1')
    }
    catch(err){
      console.log(err);
    }
    const TargetEmail='Sample@Gmail.com';
    const start=performance.now();
    const result=await this.UserInfo.findOne({email:TargetEmail}).exec()
    const End=performance.now();
      const explainNoIndex = await this.UserInfo
      .findOne({ email: TargetEmail })
      .explain('executionStats') as any;
    

      check.withoutIndex = {
      found: !!result,
      timeTakenMs: (End -start).toFixed(3),
      totalDocsExamined: explainNoIndex.executionStats.totalDocsExamined ?? 0,
      totalKeysExamined: explainNoIndex.executionStats.totalKeysExamined,
      executionTimeMillis: explainNoIndex.executionStats.executionTimeMillis,
    };

    console.log('\n🧱 Recreating index on email...');
    await this.UserInfo.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Index recreated successfully.');
    
      console.log('\n⏱ Measuring WITH index...');
    const startWithIndex = performance.now();
    const userWithIndex = await this.UserInfo.findOne({ email: TargetEmail }).exec();
    const endWithIndex = performance.now();

      check.withIndex = {
      found: !!userWithIndex,
      timeTakenMs: (endWithIndex - startWithIndex).toFixed(3),
      totalDocsExamined: explainNoIndex?.executionStats?.totalDocsExamined ?? 0,
      totalKeysExamined: explainNoIndex?.executionStats?.totalKeysExamined ?? 0,
      executionTimeMillis: explainNoIndex?.executionStats?.executionTimeMillis ?? 0,
    };

    
  return check; 
  //  await this.UserInfo.collection.dropIndex("email_1")

  // return "Done";
  }




}
