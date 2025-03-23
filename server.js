const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth(),
});

let qrCodeUrl = null;

// Event: Saat perlu scan QR
client.on("qr", async (qr) => {
  qrCodeUrl = await qrcode.toDataURL(qr);
  console.log("QR Code Updated!");
});

// Event: Saat berhasil terhubung
client.on("ready", () => {
  console.log("WhatsApp Client Ready!");
  qrCodeUrl = null; // Hapus QR setelah koneksi
});

// Start WhatsApp Client
client.initialize();

// Endpoint: Tampilkan QR Code
app.get("/qr", (req, res) => {
  if (qrCodeUrl) {
    res.send(`<img src="${qrCodeUrl}" alt="Scan QR Code">`);
  } else {
    res.send("WhatsApp sudah terhubung!");
  }
});

// Endpoint: Kirim Pairing Code
app.get("/send-code", async (req, res) => {
  const { number } = req.query;
  
  if (!number) return res.status(400).send("Nomor tidak boleh kosong!");

  const pairingCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

  try {
    await client.sendMessage(`${number}@c.us`, `Kode Pairing WhatsApp: ${pairingCode}`);
    res.send(`Kode Pairing berhasil dikirim ke ${number}`);
  } catch (err) {
    res.status(500).send("Gagal mengirim kode!");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
