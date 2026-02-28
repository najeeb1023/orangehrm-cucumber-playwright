import { After, AfterAll, Before, BeforeAll, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium } from "@playwright/test";
import { config } from "../../../playwright.config";
import { pageFixture } from "./pageFixture";
const fs = require('fs');
const axios = require('axios');
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({
  path: `.env.${process.env.ENV || "development"}`
});

let browser: Browser;
let context: BrowserContext;



function deleteFolderContentsExcept(folderPath: string, exceptions: string[] = []) {
  if (!fs.existsSync(folderPath)) {
    console.log(`❌ Folder not found: ${folderPath}`);
    return;
  };

  fs.readdirSync(folderPath).forEach(file => {
    const fullPath = path.join(folderPath, file);
    if (exceptions.includes(file)) {
      console.log(`🛑 Skipping: ${file}`);
      return;
    };

    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🗑️  Deleted folder: ${file}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`🗑️  Deleted file: ${file}`);
      };
    } catch (error) {
      console.error(`⚠️ Failed to delete ${file}:`, error);
    };
  });
};

BeforeAll(async function () {
    browser = await chromium.launch(config);
    const healthCheckUrl = process.env.HEALTHCHECK_API_URL;
    console.log(healthCheckUrl);
    const testResultsPath = path.resolve(process.cwd(), 'test-results');
    console.log('🧹 Cleaning up:', testResultsPath);
    deleteFolderContentsExcept(testResultsPath, ['logs','reports']); // deletes reports, screenshots, videos
    try {
        const response = await axios.get(healthCheckUrl);
        console.log('➡️  API Server Status:', `\x1b[1m\x1b[32m${response.data}\x1b[0m` + ' 🟢' + '\n');

        const env = (process.env.ENV || 'development').toUpperCase();
        const color = env === 'PROD' || env === 'PRODUCTION' ? '\x1b[31m' : '\x1b[32m';

        console.log(`🌐  Running tests on \x1b[1m${color}${env}\x1b[0m.` + '\n');
    } catch (error) {
        console.error('➡️  API Server Status:', `\x1b[1m\x1b[31m${error.message}\x1b[0m` + '. 🔴' + '\n');
    };
});

Before(async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext({
        viewport: {
            width: 1680,
            height: 800
        },
        recordVideo: {
            dir: `./test-results/videos/${pickle.name}.mp4`,
            size: {
            width: 1680,
            height: 800
            }
        }
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    pageFixture.page = page;
});

After(async function ({ pickle, result }) {
    const safeName = pickle.name.replace(/[^a-zA-Z0-9]/g, "_");

    const screenshotDir = path.resolve('./test-results/screenshots');

    // create folder if missing
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshot = await pageFixture.page.screenshot({
        path: `${screenshotDir}/${safeName}_${Date.now()}.png`,
        type: "png"
    });

    await this.attach(screenshot, "image/png");

    // close context (important)
    await context.close();
});

AfterAll(async function () {
    await browser.close();
});