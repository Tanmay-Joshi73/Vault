import {create} from "zustand"
interface MasterKeyState {
  masterKey: string | null;
  setMasterKey: (key: string) => void;
  clearMasterKey: () => void;
}
interface userId{
  Email:string | null,
  setuserid:(id:string)=>void,
  clearid:()=>void;
}

const useMasterKeyStore = create<MasterKeyState>((set) => ({
  masterKey: null,
  setMasterKey: (key) => set({ masterKey: key }),
  clearMasterKey: () => set({ masterKey: null }),
}));


export const StoredUserId = create<userId>((set) => ({
  Email: null,
  setuserid: (id) => set({ Email: id }),
  clearid: () => set({ Email: null }),
}));



export default useMasterKeyStore;