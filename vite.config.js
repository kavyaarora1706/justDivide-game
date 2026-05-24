import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to copy and rename uploaded assets from the brain folder to the src/assets folder on start
function copyAssetsPlugin() {
  return {
    name: 'copy-assets-plugin',
    buildStart() {
      const sourceDir = '/Users/kavyaarora/.gemini/antigravity/brain/9660d42d-cd5a-4e5f-b80c-e81f66dbbfd2';
      const destDir = path.resolve(__dirname, 'src/assets');

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const assetMap = {
        'media__1779615353507.png': 'bg-portrait.png',
        'media__1779615353527.png': 'bg-landscape.png',
        'media__1779615353535.png': 'bg-bubble.png',
        'media__1779615396571.png': 'tile-blue.png',
        'media__1779615442026.png': 'slot-border.png',
        'media__1779615442035.png': 'tile-purple.png',
        'media__1779615442047.png': 'badge-red.png',
        'media__1779615442051.png': 'cat-mascot.png',
        'media__1779615442052.png': 'tile-orange.png'
      };

      console.log('[Asset Copier] Starting to copy assets...');

      if (fs.existsSync(sourceDir)) {
        Object.entries(assetMap).forEach(([srcFile, destFile]) => {
          const srcPath = path.join(sourceDir, srcFile);
          const destPath = path.join(destDir, destFile);

          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`[Asset Copier] Copied ${srcFile} -> src/assets/${destFile}`);
          } else {
            console.warn(`[Asset Copier] Source asset not found: ${srcFile}`);
          }
        });
      } else {
        console.warn(`[Asset Copier] Brain directory not found: ${sourceDir}`);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyAssetsPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
