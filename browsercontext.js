const puppeteer = require('puppeteer-core');
const expect = require('expect');
const path = require('path');
const CHROME_EXE = path.join(__dirname, 'chrome', 'chrome.exe')
const options = {
    headless: true,
    executablePath: CHROME_EXE
}
const url = 'https://www.google.com/'
let brwoser = undefined
beforeEach('start browser', async function(){
    browser = await puppeteer.launch(options);
})

afterEach('end browser', async function(){
    await browser.close();
})

describe('browser context check', function(){
    it('default context', async function(){
        expect(browser.browserContexts().length).toBe(1)
        expect((await browser.pages()).length).toBe(1)
        const defaultContext = browser.browserContexts()[0]
        expect(defaultContext.isIncognito()).toBe(false);
    })

    it('should fire target events', async function() {
        const context = await browser.createIncognitoBrowserContext();
        const events = [];
        context.on('targetcreated', target => events.push('CREATED: ' + target.url()));
        context.on('targetchanged', target => events.push('CHANGED: ' + target.url()));
        context.on('targetdestroyed', target => events.push('DESTROYED: ' + target.url()));
        const page = await context.newPage();
        await page.goto(url);
        await page.close();
        expect(events).toEqual([
          'CREATED: about:blank',
          `CHANGED: ${url}`,
          `DESTROYED: ${url}`
        ]);
        await context.close();
      });

})
