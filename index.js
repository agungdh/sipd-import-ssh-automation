const puppeteer = require('puppeteer');
const PuppeteerVideoRecorder = require('puppeteer-video-recorder');
require('dotenv').config();

(async () => {
  const recorder = new PuppeteerVideoRecorder();

  const cookies = [
    {name: 'laravel_session', value: process.env.LARAVEL_SESSION, domain: process.env.DOMAIN},
  ];

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args:[
        '--start-maximized'
    ]
   });
  const pages = await browser.pages();
  const page = pages[0];

  await recorder.init(page, `${process.env.VIDEO_PATH}${new Date().getTime()}.mp4`);
  await recorder.start();

  await page.setCookie(...cookies);
  await page.goto(process.env.LINK_SSH, {waitUntil: 'load'});

  await page.evaluate(() => {
      $(".tambah-komponen").click();
      $("select[name=kategori_komponen]").val("16137").select2();
      $("input[name=nama_komponen]").val("nama komponen");
      $("textarea[name=spek_komponen]").val("spek komponen");
      $("select[name=satuan_komponen]").val("Ampul").select2();
      $("input[name=harga_satuan]").val("1234567");
  });

    await recorder.stop();
    await browser.close();
})();