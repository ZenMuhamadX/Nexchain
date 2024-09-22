import { leveldb } from "../init"
import { readData } from "./readData"

export const insertData = async(key: string, value: string) => {
    try {
        await leveldb.put(key, value)
    } catch (error) {
        console.log(error)
    }
}
insertData('1','1')
readData('1')