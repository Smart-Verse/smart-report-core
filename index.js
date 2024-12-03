const express = require('express');
const puppeteer = require('puppeteer');
const { MongoClient, ObjectId} = require('mongodb');
const Mustache = require("mustache");
const app = express();
const PORT = 5071;

app.use(express.json());

const uri = "mongodb://root:553322@localhost:27017";
const client = new MongoClient(uri);


app.post('/report', async (req, res)  => {
    try{
        var report = await generateReport(req.body);

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


async function generateReport(data){


    const templateHtml = await connectAndFetch();

    const finalHtml = Mustache.render(templateHtml,  { data: data.data });
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(finalHtml);

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return pdfBuffer;

}

async function connectAndFetch() {
    try {
        await client.connect();
        const db = client.db("db_report");
        const collection = db.collection("report");
        const document = await collection.findOne({ _id: new ObjectId("6747cbe9ed10506c48e28f6d") });
        return document.model;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        await client.close();
    }
}