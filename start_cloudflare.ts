import { startTunnel } from "untun";

async function attemptTunnel() {
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`[Cloudflare Attempt ${attempt}/5] Requesting trycloudflare.com tunnel...`);
    try {
      const tunnel = await startTunnel({ port: 3000 });
      const url = await tunnel?.getURL();
      if (url) {
        console.log("==================================================");
        console.log("CLOUDFLARE PUBLIC LINK READY:", url);
        console.log("==================================================");
        return;
      }
    } catch (err: any) {
      console.log(`Attempt ${attempt} failed:`, err.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

attemptTunnel();
