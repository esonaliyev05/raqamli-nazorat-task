import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    // 8000 portda ochsni yozib qo'ydim
    server: {
        port: 8000
    }
});
