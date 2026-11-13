import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(rootDir, 'src');
const publicDir = path.resolve(rootDir, 'public');
const distDir = path.resolve(rootDir, 'dist');

function syncStaticRootPlugin(): Plugin {
  return {
    name: 'sync-static-root',
    apply: 'build',
    closeBundle() {
      if (!fs.existsSync(distDir)) return;

      const distIndex = path.join(distDir, 'index.html');
      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, path.join(distDir, '404.html'));
      }
      fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

      const rootAssetsDir = path.join(rootDir, 'assets');
      if (fs.existsSync(rootAssetsDir)) {
        fs.rmSync(rootAssetsDir, { recursive: true, force: true });
      }

      for (const entry of fs.readdirSync(distDir, { withFileTypes: true })) {
        const srcPath = path.join(distDir, entry.name);
        const destPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
          fs.cpSync(srcPath, destPath, { recursive: true });
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    root: srcDir,
    publicDir,
    base: './',
    plugins: [react(), tailwindcss(), syncStaticRootPlugin()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      outDir: distDir,
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[hash][extname]',
          chunkFileNames: 'assets/[hash].js',
          entryFileNames: 'assets/[hash].js',
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
