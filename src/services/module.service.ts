import fs from 'fs';
import puppeteer, { Page } from "puppeteer";

export type CommandInput = {
    url: string;
    title: string;
}[]

type PrintParams = {
    page: Page
    uri: { url: string; title: string; }
    dirName: string
    indexOf: number
    total: number
}

export class ModuleService {
    private failedInputList: CommandInput = []

    public async execute(uriList: CommandInput): Promise<void> {
        const browser = await puppeteer.launch({ headless: true });
        // mkdir from timestamp
        const start = Date.now();
        const dirName = `outputs/${start.toString()}`;
        this.mkdir(dirName);

        const page = await browser.newPage();
        for (const [index, uri] of uriList.entries()) {
            try {
                await this.printUriWebPageToPDF({ page, uri, dirName, indexOf: index + 1, total: uriList.length });
            } catch (error: any) {
                console.log(`Error generating PDF! ${uri.title}.pdf`);
                console.log(error.message);
                this.failedInputList.push(uri);
            }
        }
        await browser.close();
        this.printResult(dirName, uriList, start);
        this.printFailed(dirName);
    }

    private printResult(dirName: string, uriList: CommandInput, start: number) {
        console.log("PDF generated complete!", dirName);
        console.log("Success:", uriList.length - this.failedInputList.length);
        console.log("Failed:", this.failedInputList.length);
        const end = Date.now();
        console.log("Time taken(sec):", (end - start) / 1000);
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

    private async printUriWebPageToPDF(payload: PrintParams) {
        const { page, uri, dirName, indexOf: index, total } = payload
        console.log(`Printing (${index}/${total}): ${uri.title}`);
        await page.goto(uri.url, { timeout: 0 });
        await page.pdf({ path: `${dirName}/${uri.title}.pdf`, format: 'A4', printBackground: true });
        console.log(`PDF generated successfully!`);
    }

    private mkdir(dirName: string) {
        fs.mkdirSync(dirName, { recursive: true });
        console.log("PDF generated at", dirName);
    }
}