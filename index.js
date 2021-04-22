
const puppeteer = require('puppeteer');

const url = ['https://www.matalan.co.uk/', "https://www.matalan.co.uk/mens", "https://www.matalan.co.uk/product/detail/s2818481_c270/nevada-print-t-shirt-navy"];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ]);

    for (let index = 0; index < url.length; index++) {
      await page.goto(url[index]);
    }

    //Retrive the coverage objects
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);

    const js_coverage = [...jsCoverage] 

    const js = js_coverage.filter(js => js.url.includes('https://www.matalan.co.uk'))

    let js_used_bytes = 0;
    let js_total_bytes = 0;
    let covered_js = "";

    for (const entry of js) {
      js_total_bytes += entry.text.length;
        // console.log(`Total Bytes for ${entry.url}: ${entry.text.length}`);
        for (const range of entry.ranges){
            js_used_bytes += range.end - range.start - 1;
            covered_js += entry.text.slice(range.start, range.end) + "\n";
        }       
    }

    console.log(`Total Bytes of JS: ${js_total_bytes}`);
    console.log(`Used Bytes of JS: ${js_used_bytes}`);
    
    await browser.close();
})();