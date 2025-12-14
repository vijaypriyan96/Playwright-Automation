import path from "path"
import fs from "fs/promises";

export default async () => {
     const storageStatePath = path.join(__dirname, 'storageState.json');
        try {
            await fs.unlink(storageStatePath);
            console.log(`Storage state file deleted at ${storageStatePath}`);
        } catch {
            console.log(`No storage state file found at ${storageStatePath}`);
        }
}
