const express = require("express");
const path = require("path");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({ authStrategy: new LocalAuth() });

let qrCodeUrl = null;

client.on("qr", async (qr) => {
  qrCodeUrl = await qrcode.toDataURL(qr);
  console.log("QR Code Updated!");
});

client.on("ready", () => {
  console.log("WhatsApp Client Ready!");
  qrCodeUrl = null;
});

client.initialize();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/qr", (req, res) => {
  if (qrCodeUrl) {
    res.send(qrCodeUrl);
  } else {
    res.send("WhatsApp sudah terhubung!");
  }
});

app.get("/api/send-code", async (req, res) => {
  const { number } = req.query;
  if (!number) return res.status(400).send("Nomor tidak boleh kosong!");

  const pairingCode = Math.floor(100000 + Math.random() * 900000);

  try {
    await client.sendMessage(`${number}@c.us`, `Kode Pairing WhatsApp: ${pairingCode}`);
    res.send(`Kode Pairing berhasil dikirim ke ${number}`);
  } catch (err) {
    res.status(500).send("Gagal mengirim kode!");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
