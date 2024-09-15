const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const {
    loginWithChromeProfile,
    navigateToProfile,
    captureProfileScreenshot,
    capturePostScreenshots,
    navigateToMessenger,
} = require('./instagramAutomation');

(async function main() {
    // Path to Chrome user profile 
    let userProfile = path.resolve('C:/Users/ankit/AppData/Local/Google/Chrome/User Data');

    let options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userProfile}`);
    options.addArguments('--profile-directory=Default');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const profileUrl = 'https://www.instagram.com/test.sih2024/';
    const screenshotDir = path.join(__dirname);

    try {
        await loginWithChromeProfile(driver, 'https://www.instagram.com/');
        await navigateToProfile(driver, profileUrl);
        await captureProfileScreenshot(driver, screenshotDir);
        await capturePostScreenshots(driver, screenshotDir);
        await navigateToMessenger(driver, screenshotDir);
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        await driver.quit();
    }
})();
