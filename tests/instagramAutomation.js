const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function loginWithChromeProfile(driver, profileUrl) {
    try {
        await driver.get(profileUrl);
        console.log("Instagram opened, checking for login status...");
        await driver.wait(until.elementLocated(By.xpath('//img[@alt="test.sih2024\'s profile picture"]')), 20000);
        console.log("Logged in to Instagram successfully using saved session!");
    } catch (err) {
        console.error('Error during Instagram session validation or login:', err);
       
    }
}

async function navigateToProfile(driver, profileUrl) {
    try {
        await driver.get(profileUrl);
        console.log('Navigated to Profile page!');
        // Wait for the profile picture to ensure the page is fully loaded
        await driver.wait(until.elementLocated(By.xpath('//img[@alt="test.sih2024\'s profile picture"]')), 20000);
    } catch (err) {
        console.error('Error navigating to Profile page:', err);
    }
}

async function captureProfileScreenshot(driver, screenshotDir) {
    try {
        const profilePicXPath = '//img[@alt="test.sih2024\'s profile picture"]';
        const profilePic = await driver.wait(until.elementLocated(By.xpath(profilePicXPath)), 20000);
        const profilePicScreenshot = await profilePic.takeScreenshot();
        const screenshotPath = path.join(screenshotDir, 'Profile_Pic.png');
        fs.writeFileSync(screenshotPath, profilePicScreenshot, 'base64');
        console.log('Profile picture screenshot saved successfully at:', screenshotPath);
    } catch (err) {
        console.error('Error capturing profile screenshot:', err);
    }
}

async function capturePostScreenshots(driver, screenshotDir) {
    try {
        const firstPost = await driver.wait(until.elementLocated(By.xpath('//div[@class="_aagw"]')), 20000);
        await firstPost.click();
        console.log('Clicked on the first post.');
        await driver.sleep(5000);

        // Screenshot of the first post image
        const postImage = await driver.wait(until.elementLocated(By.xpath('//article//img')), 20000);
        const postImageScreenshot = await postImage.takeScreenshot();
        const postScreenshotPath = path.join(screenshotDir, 'Post_1.png');
        fs.writeFileSync(postScreenshotPath, postImageScreenshot, 'base64');
        console.log('First post screenshot saved successfully at:', postScreenshotPath);

        // Navigate to next post and take screenshot
        const nextButton = await driver.wait(until.elementLocated(By.xpath('//button[@class="_abl-" and @type="button"]')), 20000);
        await nextButton.click();
        console.log('Clicked on the "Next" button.');
        await driver.sleep(5000);

        const nextPostImage = await driver.wait(until.elementLocated(By.xpath('//article//img')), 20000);
        const nextPostScreenshot = await nextPostImage.takeScreenshot();
        const nextPostScreenshotPath = path.join(screenshotDir, 'Post_2.png');
        fs.writeFileSync(nextPostScreenshotPath, nextPostScreenshot, 'base64');
        console.log('Next post screenshot saved successfully at:', nextPostScreenshotPath);

        // Close post view
        const closeButtons = await driver.findElements(By.xpath('//*[name()="svg" and @aria-label="Close"]'));
        if (closeButtons.length > 0) {
            await closeButtons[0].click();
            console.log('Closed the post view.');
        } else {
            console.log('Close button not found.');
        }
    } catch (err) {
        console.error('Error capturing post screenshots:', err);
    }
}

async function navigateToMessenger(driver, screenshotDir) {
    try {
        await driver.wait(until.elementLocated(By.xpath('//a[@href="/direct/inbox/"]')), 20000);
        await driver.findElement(By.xpath('//a[@href="/direct/inbox/"]')).click();
        console.log('Navigated to Messenger!');
        await driver.sleep(10000);

        //  first chat click logic
        await driver.wait(until.elementLocated(By.css('div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x6s0dn4.xozqiw3.x1q0g3np')), 20000);
        const firstChat = await driver.findElement(By.css('div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x6s0dn4.xozqiw3.x1q0g3np'));
        await firstChat.click();
        console.log('Clicked on the first chat!');
        await driver.sleep(5000);

        // Screenshot the first chat
        const pageScreenshot = await driver.takeScreenshot();
        fs.writeFileSync(path.join(screenshotDir, 'Chat_1.png'), pageScreenshot, 'base64');
        console.log('Screenshot of the entire page taken and saved as Chat_1.png');

        const chatContainerSelector = 'div.chat-container-selector';
        try {
            const chatContainer = await driver.findElement(By.css(chatContainerSelector));
            const chatScreenshot = await chatContainer.takeScreenshot();
            fs.writeFileSync(path.join(screenshotDir, 'chat-screenshot.png'), chatScreenshot, 'base64');
            console.log('Screenshot of the chat container taken and saved as chat-screenshot.png');
        } catch (err) {
            console.log('Could not locate the chat container. Check the selector or page state.');
        }
    } catch (err) {
        console.error('Error navigating to Messenger or capturing screenshot:', err);
    }
}


module.exports = {
    loginWithChromeProfile,
    navigateToProfile,
    captureProfileScreenshot,
    capturePostScreenshots,
    navigateToMessenger,
};
