import puppeteer from 'puppeteer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

const TASKS = [
    // Motion Projects
    {
        key: 'social2',
        url: 'http://localhost:3000/projects/motion/social2/video.mp4',
        rawPath:   path.join(publicDir, 'projects/motion/social2/thumb_raw.png'),
        finalPath: path.join(publicDir, 'projects/motion/social2/thumb.png'),
        isModel: false
    },
    {
        key: 'techlife',
        url: 'http://localhost:3000/projects/motion/techlife/video.mp4',
        rawPath:   path.join(publicDir, 'projects/motion/techlife/thumb_raw.png'),
        finalPath: path.join(publicDir, 'projects/motion/techlife/thumb.png'),
        isModel: false
    },
    {
        key: 'mograph',
        url: 'http://localhost:3000/projects/motion/mograph/video.mp4',
        rawPath:   path.join(publicDir, 'projects/motion/mograph/thumb_raw.png'),
        finalPath: path.join(publicDir, 'projects/motion/mograph/thumb.png'),
        isModel: false
    }
];

const W = 1920, H = 1080;

(async () => {
    console.log('Launching browser at 1920x1080...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-webgl',
            '--use-gl=angle',
            '--enable-unsafe-webgl',
            '--ignore-gpu-blocklist',
            `--window-size=${W},${H}`,
        ],
    });

    for (const task of TASKS) {
        console.log(`\nProcessing task: ${task.key}`);
        const page = await browser.newPage();
        await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

        console.log(`  → ${task.url}`);

        try {
            await page.goto(task.url, { waitUntil: 'networkidle2', timeout: 60000 });

            if (task.isModel) {
                // Wait for model ready signal
                try {
                    await page.waitForFunction(
                        () => window.__MODEL_READY__ === true,
                        { timeout: 20000, polling: 500 }
                    );
                    console.log(`  ✓ Model ready`);
                } catch {
                    console.log(`  ⚠ Model ready signal timeout, continuing...`);
                }
                await new Promise(r => setTimeout(r, 3000));
            } else {
                // For videos, wait a bit for the first frame to render
                await new Promise(r => setTimeout(r, 2000));
            }

            // Ensure directory exists
            const dir = path.dirname(task.rawPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            // Screenshot
            await page.screenshot({
                path: task.rawPath,
                clip: { x: 0, y: 0, width: W, height: H },
            });
            console.log(`  ✓ Raw saved: ${path.basename(task.rawPath)}`);

            // Confirm output size with sharp
            const meta = await sharp(task.rawPath).metadata();
            console.log(`  ✓ Size: ${meta.width}x${meta.height}`);

            // Copy raw → final
            fs.copyFileSync(task.rawPath, task.finalPath);
            console.log(`  ✓ Final saved: ${path.basename(task.finalPath)}`);
            
        } catch (err) {
            console.error(`  ❌ Error processing ${task.key}:`, err.message);
        }

        await page.close();
    }

    await browser.close();
    console.log('\n✅ All tasks completed.');
})();
