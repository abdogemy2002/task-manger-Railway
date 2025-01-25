import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT) || 4173, // السماح لريلوى بتحديد البورت
    host: '0.0.0.0', // يضمن أن التطبيق متاح على الشبكة العامة
  },
  build: {
    outDir: 'dist', // تأكد من مسار الإخراج
  },
  base: './', // لضمان تحميل الملفات بشكل صحيح
  preview: {
    allowedHosts: ['task-manger-railway-production.up.railway.app'], // أضف الهوست هنا
  },
});
