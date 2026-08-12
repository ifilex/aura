// server/index.ts
import express from 'express';
import cors from 'cors';
import searchRouter from './api/search.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/search', searchRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err?.message || 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
    console.log(`📡 Endpoint: http://localhost:${PORT}/api/search`);
});