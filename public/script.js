const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

let qrCodeData = null;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on("qr", async (qr) => {
    console.log("QR Code received, generating image...");
    qrCodeData = await qrcode.toDataURL(qr);
});

client.on("ready", () => {
    console.log("WhatsApp Web Client is ready!");
    qrCodeData = null; // Reset QR setelah login
});

client.on("disconnected", (reason) => {
    console.log("WhatsApp disconnected:", reason);
    qrCodeData = null;
});

client.initialize();

app.get("/qr", (req, res) => {
    if (qrCodeData) {
        res.json({ qr: qrCodeData });
    } else {
        res.json({ qr: null, message: "QR Code belum tersedia atau sudah login." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
