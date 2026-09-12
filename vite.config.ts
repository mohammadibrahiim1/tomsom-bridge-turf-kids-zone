import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // .env ফাইল থেকে ভেরিয়েবলগুলো লোড করা হচ্ছে
  const env = loadEnv(mode, process.cwd());

  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // .env ফাইলের VITE_PORT দিয়ে সার্ভার রান করবে (ডিফল্ট ৩০০০ বা ৫১৭৩ রাখতে পারেন)
      port: parseInt(env.VITE_PORT || '3000'), 
      
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});