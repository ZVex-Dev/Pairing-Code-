async function fetchQRCode() {
    try {
        const response = await fetch("/qr");
        const data = await response.json();
        
        if (data.qr) {
            document.getElementById("qr-code").src = data.qr;
        } else {
            document.getElementById("qr-code").src = "";
            alert("QR Code belum tersedia atau sudah login.");
        }
    } catch (error) {
        console.error("Gagal mengambil QR Code:", error);
        alert("Terjadi kesalahan saat mengambil QR Code.");
    }
}

function refreshQR() {
    fetchQRCode();
}

window.onload = fetchQRCode;
