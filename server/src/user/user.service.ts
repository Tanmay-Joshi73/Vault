import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vault } from './Schemas/vault.schema';
import { User } from './Schemas/user.schema';
import { VaultEntry } from './Schemas/vault.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { log } from 'node:console';
import { DelData } from './user.controller';
interface VaultInfo{
    encryptedWebsite:string,
    encryptedUsername:string,
    encryptedPassword:string,
    encryptedFolder:string,
    email:string
}
@Injectable()
export class UserService {
    constructor(
        @InjectModel(Vault.name) private UserData:Model<Vault>,
        @InjectModel(User.name) private UserInfo:Model<User>,
){}

async findVaultEntry(email: string): Promise<any> {
  try {
    console.log("🔍 Fetching vault entries for:", email);

    // 1️⃣ Find the user by email
    const ExistingUser = await this.UserInfo.findOne({ email }).select('+_id');
    if (!ExistingUser) {
      console.log("⚠️ User not found");
      throw new NotFoundException("User not found");
    }

    const userId = ExistingUser._id;

    // 2️⃣ Find the vault document for that user
    const vault = await this.UserData.findOne({ user: userId })
      .populate("user")
      .exec();

    // 3️⃣ If vault doesn't exist
    if (!vault) {
      console.log("⚠️ Vault not found for this user");
      return {
        success: true,  // Frontend expects success: true
        data: []        // Frontend expects data array
      };
    }

    // console.log(vault.Entries);
    
    
    
    // 4️⃣ Return entries in the format frontend expects
    return {
           success: true,  // ✅ CRITICAL: Frontend checks this
// Important: frontend checks response.data.success
        data: vault.Entries.map((entry) => ({
        id: entry._id, // Frontend needs id
        encryptedWebsite:  entry.url, // Handle both encrypted and plain
        encryptedUsername: entry.username,
        encryptedPassword:  entry.password,
        encryptedUrl:  entry.url,
        encryptedFolder: entry.folder,
        encryptedid:entry._id,
        createdAt: new Date().toISOString(),
        updatedAt:  new Date().toISOString(),
        email: email
      }))
    };
  } catch (error) {
    console.error("❌ Error while fetching vault entries:", error);
    return {
      success: false,
      message: "Failed to fetch vault entries"
    };
  }
}s

async AddEntry(vaultData: VaultInfo): Promise<any> {
  try {
    const { encryptedUsername, encryptedWebsite, encryptedFolder, encryptedPassword, email } = vaultData;

    const ExistingUser = await this.UserInfo.findOne({ email });
    if (!ExistingUser) throw new NotFoundException("user not found");

    const userId = ExistingUser._id;
    let vaultEntry = await this.UserData.findOne({ user: userId });

    if (!vaultEntry) {
      console.log("Vault entry not present, creating new one...");
      vaultEntry = new this.UserData({
        user: userId,
        Entries: []
      });
    }

    const VaultEntry
    vaultEntry.Entries.push({
      username:encryptedUsername,
      url: encryptedWebsite,
      password: encryptedPassword,
      folder:encryptedFolder
    });

    await vaultEntry.save();

    console.log("Entries saved to the database successfully!");
    return vaultEntry;
  } catch (error) {
    console.error("Error while adding entry:", error);
    throw error;
  }
}

async DeleteEntry(DT:DelData):Promise<any>{
try {

    // 1️⃣ Find the user by email
    
    const {email,credentialId}={...DT};
    
      const existingUser = await this.UserInfo.findOne({email:email});
    if (!existingUser) {
      console.log("⚠️ User not found");
      return {
        success: false,
        message: "User not found"
      };
    }
    console.log(existingUser);
    const userId = existingUser._id;
    console.log('user id ',userId);
    console.log('entry id ',credentialId)
    const result=await this.UserData.updateOne(
      {user:userId},
      {$pull:{Entries:{_id:credentialId}}}
    );
    if(result.modifiedCount==0){
      console.log("Nothing present in the database");
         return {
        success: false,
        message: "Credential entry not found"
      };
    }
      console.log("✅ Credential deleted successfully");
    return {
      success: true,
      message: "Credential deleted successfully"
    };
}
catch(err){
  
  console.log(err)
}
}
}


