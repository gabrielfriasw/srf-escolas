import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Excluir pacotes específicos da otimização
    exclude: ['lucide-react'],
  },
  server: {
    // Configuração da porta do servidor de desenvolvimento
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        // Separar dependências principais em chunks separados
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});