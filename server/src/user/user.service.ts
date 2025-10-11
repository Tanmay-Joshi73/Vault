import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vault } from './Schemas/vault.schema';
import { User } from './Schemas/user.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { log } from 'node:console';
interface VaultInfo{
    website:string,
    username:string,
    encryptedPassword:string,
    folder:string,
    email:string
}
@Injectable()
export class UserService {
    constructor(
        @InjectModel(Vault.name) private Entries:Model<Vault>,
        @InjectModel(User.name) private UserInfo:Model<User>
){}
async findVaultEntry():Promise<any>{
    console.log("Inner deep into the Srvice Services method")
    const Entries=await this.Entries.find() ;
    return Entries;
}
async AddEntry(vaultData:VaultInfo):Promise<any>{
    console.log(vaultData)
   const {username,website,folder,encryptedPassword,email}={...vaultData};
    console.log(email);
    
    try{
        
    }
    catch(err){
        console.log(err)
    }
}
}
