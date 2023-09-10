import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'enhanced_google_chat',
      fileName: (format) => `enhanced_google_chat.${format}.js`,
      formats: ['es']
    },
    sourcemap: true,
  }
});
