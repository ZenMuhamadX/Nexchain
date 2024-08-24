import crypto from "node:crypto"
import { transaction } from "../Tx/Tx";

export const generateBlockHash = (index:number,timestamp:string,Tx:transaction[],previousHash:string)=>{
    const hash = crypto.createHash("sha256");
    hash.update(`${index}${timestamp}${Tx}${previousHash}`);
    return hash.digest("hex");
}