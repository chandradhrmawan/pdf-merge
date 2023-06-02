const { PDFDocument, StandardFonts, rgb, PDFImage } = require('pdf-lib');
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const {signer} = require('./signer/signer')

async function addSignatureFieldToPDF(filePath) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
  const pages = pdfDoc.getPages();

  // Mendapatkan halaman terakhir
  const lastPage = pages[pages.length - 1];

  // Menentukan posisi dan ukuran tanda tangan
  const x = 10;
  const y = 80;
  const width = 1170; //360
  const height = 150;

  // Mengonversi HTML menjadi gambar PNG dengan menggunakan Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(signer);
  await page.setViewport({ width, height });
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  // Membuat objek gambar PDFImage
  const pdfImage = await pdfDoc.embedPng(screenshot);

  // Menggambar gambar tanda tangan pada halaman PDF
  lastPage.drawImage(pdfImage, {
    x,
    y,
    width,
    height,
  });

  // Menyimpan PDF yang telah dimodifikasi
  const modifiedPdfBytes = await pdfDoc.save();

  // Menyimpan file PDF yang dimodifikasi
  fs.writeFileSync('./result/modified.pdf', modifiedPdfBytes);
}

async function addStamp(filePath) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
  const pages = pdfDoc.getPages();

  // Mendapatkan halaman terakhir
  const lastPage = pages[pages.length - 1];

  const x = 815;
  const y = 80;
  const width = 360; //360
  const height = 110;

  // Mengonversi HTML menjadi gambar PNG dengan menggunakan Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(stamp);
  await page.setViewport({ width, height });
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  // Membuat objek gambar PDFImage
  const pdfImage = await pdfDoc.embedPng(screenshot);

  // Menggambar gambar tanda tangan pada halaman PDF
  lastPage.drawImage(pdfImage, {
    x,
    y,
    width,
    height,
  });

  // Menyimpan PDF yang telah dimodifikasi
  const modifiedPdfBytes = await pdfDoc.save();

  // Menyimpan file PDF yang dimodifikasi
  fs.writeFileSync('./result/modified_with_stamp.pdf', modifiedPdfBytes);
}



async function clearDir(directory = './result') {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

async function main() {
  await clearDir('./result')
  await addSignatureFieldToPDF('./pdf/lembar_kontrol.pdf');
}

main()