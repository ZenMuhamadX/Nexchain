import { leveldb } from "../init"

export const insertData = async(key: string, value: string) => {
    try {
        await leveldb.put(key, value)
    } catch (error) {
        console.log(error)
    }
}