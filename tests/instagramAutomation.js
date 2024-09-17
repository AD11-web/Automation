const { By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

let Instagram = {};
Instagram.loginWithChromeProfile = async function loginWithChromeProfile(driver, username) {
    try {
        const profileUrl = "https://www.instagram.com/" + username;
        await driver.get(profileUrl);
        console.log("Instagram opened, checking for login status...");
        await driver.wait(until.elementLocated(By.xpath(`//img[@alt="${username}'s profile picture"]`)), 20000);
        console.log("Logged in to Instagram successfully using saved session!");
    } catch (err) {
        console.error("Error during Instagram session validation or login:", err);
    }
};

Instagram.navigateToProfile = async function navigateToProfile(driver, username) {
    try {
        const profileUrl = "https://www.instagram.com/" + username;
        await driver.get(profileUrl);
        console.log("Navigated to Profile page!");

        // Wait for the profile picture to ensure the page is fully loaded
        await driver.wait(until.elementLocated(By.xpath(`//img[@alt="${username}'s profile picture"]`)), 20000);
        await driver.sleep(10000);
    } catch (err) {
        console.error("Error navigating to Profile page:", err);
    }
};

Instagram.captureProfileScreenshot = async function captureProfileScreenshot(driver, username, screenshotDir) {
    try {
        const profilePicXPath = `//img[@alt="${username}\'s profile picture"]`;
        await driver.wait(until.elementLocated(By.xpath(profilePicXPath)), 20000);
        const profilePicScreenshot = await driver.takeScreenshot();
        const screenshotPath = path.join(screenshotDir, "Profile_Pic.png");
        fs.writeFileSync(screenshotPath, profilePicScreenshot, "base64");
        console.log("Profile picture screenshot saved successfully at:", screenshotPath);
    } catch (err) {
        console.error("Error capturing profile screenshot:", err);
    }
};

Instagram.capturePostScreenshots = async function capturePostScreenshots(driver, screenshotDir) {
    try {
        const firstPost = await driver.wait(until.elementLocated(By.xpath('//div[@class="_aagw"]')), 20000);
        await firstPost.click();
        console.log("Clicked on the first post.");
        await driver.sleep(5000);

        let postCount = 1;
        const postLimit = 100; // Post limit

        while (postCount <= postLimit) { 
            // Screenshot of the post image
            const postImage = await driver.wait(until.elementLocated(By.xpath("//article//img")), 20000);
            const postImageScreenshot = await driver.takeScreenshot();
            const postScreenshotPath = path.join(screenshotDir, `Post_${postCount}.png`);
            fs.writeFileSync(postScreenshotPath, postImageScreenshot, "base64");
            console.log(`Post ${postCount} screenshot saved successfully at: ${postScreenshotPath}`);

            postCount++;

            // Check if the "Next" button exists
            let nextButton;
            try {
              
                nextButton = await driver.findElement(By.xpath('//button//*[name()="svg" and @aria-label="Next"]')); // XPath for "Next" button
            } catch (err) {
                console.log('No more posts or "Next" button not found. Ending loop.');
                break; // Exit the loop if the "Next" button is not found
            }

            // Clicking on the "Next" button to move to the next post
            await nextButton.click();
            console.log('Clicked on the "Next" button.');
            await driver.sleep(5000); 
        }

        // After all posts have been processed or limit is reached then 'post view' will get closed 
        const closeButtons = await driver.findElements(By.xpath('//*[name()="svg" and @aria-label="Close"]'));
        if (closeButtons.length > 0) {
            await closeButtons[0].click();
            console.log("Closed the post view.");
        } else {
            console.log("Close button not found.");
        }
    } catch (err) {
        console.error("Error capturing post screenshots:", err);
    }
};



Instagram.navigateToMessenger = async function navigateToMessenger(driver, screenshotDir) {
    try {
        await driver.wait(until.elementLocated(By.xpath('//a[@href="/direct/inbox/"]')), 20000);
        await driver.findElement(By.xpath('//a[@href="/direct/inbox/"]')).click();
        console.log("Navigated to Messenger!");
        await driver.sleep(10000);

         //  first chat click logic
         await driver.wait(until.elementLocated(By.css('div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x6s0dn4.xozqiw3.x1q0g3np')), 20000);
         const firstChat = await driver.findElement(By.css('div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x2lah0s.x1qughib.x6s0dn4.xozqiw3.x1q0g3np'));
         await firstChat.click();
         console.log('Clicked on the first chat!');
         await driver.sleep(5000);
 

        const pageScreenshot = await driver.takeScreenshot();
        fs.writeFileSync(path.join(screenshotDir, "Chat_1.png"), pageScreenshot, "base64");
        console.log("Screenshot of the entire page taken and saved as Chat_1.png");

        const chatContainerSelector = "div.chat-container-selector";
        try {
            const chatContainer = await driver.findElement(By.css(chatContainerSelector));
            const chatScreenshot = await chatContainer.takeScreenshot();
            fs.writeFileSync(path.join(screenshotDir, "chat-screenshot.png"), chatScreenshot, "base64");
            console.log("Screenshot of the chat container taken and saved as chat-screenshot.png");
        } catch (err) {
            console.log("Could not locate the chat container. Check the selector or page state.");
        }
    } catch (err) {
        console.error("Error navigating to Messenger or capturing screenshot:", err);
    }
};

module.exports = Instagram;
