const express = require('express');
const puppeteer = require('puppeteer');
const { resolvePageLayout, isThermalFormat } = require('./page-layout');

const app = express();
const PORT = Number(process.env.PORT || 5071);

app.use(express.json({ limit: '20mb' }));

app.post('/report', async (req, res) => {
    try {
        const { report, pageFormat = 'A4', pageOrientation = 'PORTRAIT' } = req.body || {};
        if (typeof report !== 'string' || report.trim() === '') {
            return res.status(400).json({ message: 'report must be a non-empty HTML string' });
        }

        const pdf = await generateReport(report, pageFormat, pageOrientation);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="generated.pdf"',
            'Content-Length': pdf.length
        });
        return res.send(pdf);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message || 'Unable to generate report' });
    }
});

async function generateReport(template, pageFormat = 'A4', pageOrientation = 'PORTRAIT') {
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--force-color-profile=srgb',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--no-zygote'
            ],
            timeout: 60000
        });

        const page = await browser.newPage();
        await page.setContent(template, { waitUntil: 'networkidle0', timeout: 60000 });

        let contentHeight = 1;
        if (isThermalFormat(pageFormat)) {
            contentHeight = await page.evaluate(async () => {
                if (document.fonts) await document.fonts.ready;
                return Math.max(
                    document.documentElement?.scrollHeight || 0,
                    document.body?.scrollHeight || 0,
                    1
                );
            });
        }

        const layout = resolvePageLayout(pageFormat, pageOrientation, contentHeight);
        const pdfBuffer = await page.pdf({
            ...layout,
            displayHeaderFooter: false,
            printBackground: true,
            preferCSSPageSize: false
        });
        return Buffer.from(pdfBuffer);
    } finally {
        if (browser) await browser.close();
    }
}

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`SmartReport Core listening on http://localhost:${PORT}`);
    });
}

module.exports = { app, generateReport };
