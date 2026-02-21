// vite.config.ts (프론트 폴더 루트에)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,           // ← 이걸로 고정
    open: true,           // 자동으로 브라우저 열림
    strictPort: true,     // 포트 충돌 시 에러 띄움 (편함)
  },
})
