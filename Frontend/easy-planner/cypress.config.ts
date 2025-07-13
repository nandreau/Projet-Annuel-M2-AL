import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/integration/**/*.spec.ts',
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: true
  }
});