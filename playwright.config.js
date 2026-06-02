import { defineConfig } from '@playwright/test';

const siteRoot =
  '/Users/tarunagarwal/Documents/1_App Developement_Tarun/Open Access UK/open-access-uk-site';

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.js'],
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: {
    command: `npx http-server "${siteRoot}" -p 4173 -s`,
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true
  }
});
