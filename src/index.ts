import { ModuleService } from "./services/module.service";
import fs from 'fs';
import path from 'path';
import { z } from 'zod'



process.on('exit', () => {
    console.log('Command completed');
    console.log('Press Ctrl/Command + C to exit this process');
});

const moduleService = new ModuleService();



const uriInfoSchema = z.object({
    url: z.string().url(),
    title: z.string(),
})
// Now add this object into an array
const uriListSchema = z.array(uriInfoSchema)

;(async () => {
    try {
        const dataJSONString = fs.readFileSync(path.join(__dirname, '../input', 'data.json'), 'utf8');
        const data = JSON.parse(dataJSONString);
        await moduleService.execute(uriListSchema.parse(data));
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.log(err.issues);
        }
    }
    process.exit(0)
})();
