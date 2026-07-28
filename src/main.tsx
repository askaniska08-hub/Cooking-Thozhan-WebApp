import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { FavoritesProvider } from '@/context/FavoritesContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </StrictMode>
);
