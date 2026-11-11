import express from 'express';
import gorselSunucu from './src/SunucuIsleri/GorselSunucu';
import arsivSunucu from './src/SunucuIsleri/ArsivSunucu';
import yapayZekaSunucu from './src/SunucuIsleri/YapayZekaSunucu';

const app = express();

// Güvenli CORS ve Preflight Başlıkları
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Modüler Rotalar
app.use('/api', gorselSunucu);
app.use('/api', arsivSunucu);
app.use('/api', yapayZekaSunucu);

// Vite middleware entegrasyonu (dev ortamı) ve statik dosya sunumu (prodüksiyon ortamı)
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: false,
      ws: false,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const path = await import('path');
  const fs = await import('fs');
  const distYolu = path.resolve('dist');
  if (fs.existsSync(distYolu)) {
    app.use(express.static(distYolu));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distYolu, 'index.html'));
    });
  }
}

// Global Hata Yakalama Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Express Hatası]:', err);
  if (!res.headersSent) {
    res.status(500).json({ basarili: false, hata: 'Sunucu içi hata oluştu.' });
  }
});

function bayrakDegeriAl(bayrak: string): string | undefined {
  const sira = process.argv.indexOf(bayrak);
  return sira !== -1 && process.argv[sira + 1] ? process.argv[sira + 1] : undefined;
}

const cliPort = bayrakDegeriAl('--port');
const cliHost = bayrakDegeriAl('--host');

// AI Studio ortamında dev sunucusu port 3000 üzerinde dinlemelidir
const PORT = Number(cliPort) || (process.env.NODE_ENV === 'production' && process.env.PORT ? Number(process.env.PORT) : 3000);
const HOST = cliHost || '0.0.0.0';

process.on('unhandledRejection', (reason) => {
  console.warn('[Sunucu Uyarısı - Unhandled Rejection]:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Sunucu Hatası - Uncaught Exception]:', err);
});

const sunucu = app.listen(PORT, HOST, () => {
  console.log(`[Afyon Ev Lezzetleri]: Sunucu ${HOST}:${PORT} adresinde dinlemeye başladı.`);
});

sunucu.on('error', (err: any) => {
  console.error('[Sunucu Soket Hatası]:', err);
});

