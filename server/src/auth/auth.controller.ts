import { Controller } from '@nestjs/common';
import { Get,Body,Post} from '@nestjs/common';
import  {Auth} from './DTOs/auth.dto';
import { SignUp,SignUpResponce } from './AuthTypes/Auth';;
import { vaultData } from './DTOs/vaultData.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
    constructor(private readonly Auth:AuthService){}
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




}
