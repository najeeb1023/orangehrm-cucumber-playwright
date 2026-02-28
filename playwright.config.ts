import { LaunchOptions } from "@playwright/test";

export const config: LaunchOptions = {
  timeout: 30000,
  headless: true,
  slowMo: 350,
};
