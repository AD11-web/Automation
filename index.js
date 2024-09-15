const { createDriver, openWhatsAppWeb, handleChats } = require('./tests/whatsappAutomation');

(async function run() {
    let driver = null;

    try {
        driver = await createDriver();
        await openWhatsAppWeb(driver);

        // As so far we have taken only 3 words for testing  We can add more suspicious words later
        let suspiciousWords = ['murder', 'gun', 'kill'];

        for (let wordIndex = 0; wordIndex < suspiciousWords.length; wordIndex++) {
            let word = suspiciousWords[wordIndex];
            await handleChats(driver, word);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (driver) {
            await driver.quit();
            console.log("Browser closed successfully.");
        }
    }
})();
