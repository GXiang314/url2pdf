import fs from 'fs';
import puppeteer from "puppeteer";

export type CommandInput = {
    url: string;
    title: string;
}[]

export class ModuleService {
    constructor() {
    }

    public async execute(uriList: CommandInput): Promise<string> {
        const browser = await puppeteer.launch({ headless: true });
        // mkdir from timestamp
        const dirName = `outputs/${Date.now().toString()}`;
        fs.mkdirSync(dirName, { recursive: true });
        for (const uri of uriList) {
            try {
                const page = await browser.newPage();
                await page.goto(uri.url, {timeout: 0});
                await page.pdf({ path: `${dirName}/${uri.title}.pdf`, format: 'A4', printBackground: true });
                console.log(`PDF generated successfully! ${uri.title}.pdf`);
            } catch (error: any) {
                console.log(`Error generating PDF! ${uri.title}.pdf`);
                console.log(error.message);
            }
        }
        await browser.close();

        return "Hello World";
    }
}