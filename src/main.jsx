import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker to enable offline support and auto-updates
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);