const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 5071;

app.use(express.json());


app.post('/report', async (req, res)  => {
    try{
        var report = await generateReport(req.body.report);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="generated.pdf"',
            'Content-Length': report.length,
        });
        res.send(report);
    } catch (error){
        res.status(400).json(req.body);
    }

});


app.listen(PORT, () => {
    console.log(` http://localhost:${PORT}`);
});


async function generateReport(template){

    try{
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    
        const page = await browser.newPage();
        await page.setContent(template);
        const pdfBuffer = await page.pdf(
    {
                format: 'A4' ,
                displayHeaderFooter: false,
                background: true
            });
        await browser.close();
    
        const pdf = Buffer.from(pdfBuffer);
    
        return pdf;
    } catch(e){
        console.log(e);
    }
}
