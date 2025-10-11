import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vault } from './Schemas/vault.schema';
import { User } from './Schemas/user.schema';
import { VaultEntry } from './Schemas/vault.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
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
        @InjectModel(Vault.name) private UserData:Model<Vault>,
        @InjectModel(User.name) private UserInfo:Model<User>,
){}

async findVaultEntry(email: string): Promise<any> {
  try {
    console.log("🔍 Fetching vault entries for:", email);

    // 1️⃣ Find the user by email
    const ExistingUser = await this.UserInfo.findOne({ email });
    if (!ExistingUser) {
      console.log("⚠️ User not found");
      throw new NotFoundException("User not found");
    }

    const userId = ExistingUser._id;

    // 2️⃣ Find the vault document for that user
    const vault = await this.UserData.findOne({ user: userId })
      .populate("user") // optional, adds email to response
      .exec();

    // 3️⃣ If vault doesn’t exist
    if (!vault) {
      console.log("⚠️ Vault not found for this user");
      return {
        message: "Vault not found for this user",
        entries: [],
      };
    }
    console.log(vault);
    
    // 4️⃣ Return formatted entries
    return {
      message: "Vault entries fetched successfully",
      totalEntries: vault.Entries.length,
      entries: vault.Entries.map((e) => ({
        username: e.username,
        url: e.url,
        password: e.password,
      })),
    };
  } catch (error) {
    console.error("❌ Error while fetching vault entries:", error);
    throw new Error("Failed to fetch vault entries");
  }
}

async AddEntry(vaultData: VaultInfo): Promise<any> {
  try {
    const { username, website, folder, encryptedPassword, email } = vaultData;

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

    vaultEntry.Entries.push({
      username,
      url: website,
      password: encryptedPassword,
    //   folder:folder
    });

    await vaultEntry.save();
    console.log("Entries saved to the database successfully!");
    return vaultEntry;
  } catch (error) {
    console.error("Error while adding entry:", error);
    throw error;
  }
}
}

