import fs from 'fs';
import puppeteer, { Page } from "puppeteer";

export type CommandInput = {
    url: string;
    title: string;
}[]

export class ModuleService {
    private failedInputList: CommandInput = []

    public async execute(uriList: CommandInput): Promise<void> {
        const browser = await puppeteer.launch({ headless: true });
        // mkdir from timestamp
        const dirName = `outputs/${Date.now().toString()}`;
        this.mkdir(dirName);

        const page = await browser.newPage();
        for (const uri of uriList) {
            try {
                await this.printUriWebPageToPDF(page, uri, dirName);
            } catch (error: any) {
                console.log(`Error generating PDF! ${uri.title}.pdf`);
                console.log(error.message);
                this.failedInputList.push(uri);
            }
        }
        await browser.close();
        console.log("PDF generated complete!", dirName);
        console.log("Success:", uriList.length - this.failedInputList.length);
        console.log("Failed:", this.failedInputList.length);
        this.printFailed(dirName);
    }

    private printFailed(dirName: string) {
        if (this.failedInputList.length > 0) {  
            console.log("Failed to generate PDF:", this.failedInputList);
            const pathToSave = `${dirName}_failed.json`;
            const json = JSON.stringify(this.failedInputList);
            fs.writeFileSync(pathToSave, json);
            console.log(`Failed to generate Input Data: ${pathToSave}`);
        }
    }

    private async printUriWebPageToPDF(page: Page, uri: { url: string; title: string; }, dirName: string) {
        await page.goto(uri.url, { timeout: 0 });
        await page.pdf({ path: `${dirName}/${uri.title}.pdf`, format: 'A4', printBackground: true });
        console.log(`PDF generated successfully! ${uri.title}.pdf`);
    }

    private mkdir(dirName: string) {
        fs.mkdirSync(dirName, { recursive: true });
        console.log("PDF generated at", dirName);
    }
}