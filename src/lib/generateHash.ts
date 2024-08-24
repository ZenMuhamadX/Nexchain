import crypto from "node:crypto"
import { transactionInterface } from "../Tx/Tx";

export const generateBlockHash = (index:number,timestamp:string,Tx:transactionInterface[],previousHash:string)=>{
    const hash = crypto.createHash("sha256");
    hash.update(`${index}${timestamp}${Tx}${previousHash}`);
    return hash.digest("hex");
}