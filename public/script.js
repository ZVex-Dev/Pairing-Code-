async function fetchQRCode() {
    const response = await fetch("/qr");
    const data = await response.json();
    
    if (data.qr) {
        document.getElementById("qr-code").src = data.qr;
    } else {
        document.getElementById("qr-code").src = "";
        alert("QR Code belum tersedia. Coba lagi nanti.");
    }
}

function refreshQR() {
    fetchQRCode();
}

window.onload = fetchQRCode;
