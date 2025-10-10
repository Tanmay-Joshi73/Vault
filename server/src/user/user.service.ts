import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vault,VaultSchema } from './Schemas/vault.schema';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
    constructor(@InjectModel(Vault.name) private Entries:Model<Vault>){}
async findVaultEntry():Promise<any>{
    console.log("Inner deep into the Srvice Services method")
    const Entries=await this.Entries.find() ;
    return Entries;
}
async AddEntry():Promise<any>{
    console.log("Inside the services function")
}
}
