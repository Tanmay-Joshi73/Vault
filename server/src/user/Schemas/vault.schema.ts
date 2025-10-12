import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document,Types } from "mongoose";
import { User } from "./user.schema";
@Schema()
export class VaultEntry{
    @Prop({required:true})
    username:string
    @Prop({required:true})
    url:string
    @Prop({required:true})
    password:string
    @Prop({required:true,default:'None'})
    folder:string
}
@Schema()
export class Vault{
    @Prop({type:Types.ObjectId,ref:User.name,required:true})
    user:Types.ObjectId
    @Prop({type:[VaultEntry],default:[]})
    Entries:VaultEntry[]
}


export const VaultSchema=SchemaFactory.createForClass(Vault)