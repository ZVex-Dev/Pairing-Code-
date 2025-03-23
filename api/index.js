const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const app = express();
const client = new Client({ authStrategy: new LocalAuth() });

let qrCodeUrl = null;

client.on("qr", async (qr) => {
  qrCodeUrl = await qrcode.toDataURL(qr);
});

client.on("ready", () => {
  qrCodeUrl = null;
});

client.initialize();

app.get("/qr", (req, res) => {
  if (qrCodeUrl) res.send(qrCodeUrl);
  else res.send("WhatsApp sudah terhubung!");
});

app.get("/send-code", async (req, res) => {
  const { number } = req.query;
  if (!number) return res.status(400).send("Nomor tidak boleh kosong!");
  
  const pairingCode = Math.floor(100000 + Math.random() * 900000);
  try {
    await client.sendMessage(`${number}@c.us`, `Kode Pairing: ${pairingCode}`);
    res.send(`Kode Pairing berhasil dikirim ke ${number}`);
  } catch (err) {
    res.status(500).send("Gagal mengirim kode!");
  }
});

module.exports = app;
