import express from 'express';
import cors from 'cors';
import config from './configuration/config.js';

const { port, hostname } = config;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
  });
});

app.listen(port, hostname, () => {
    console.log(`Server is running on port http://${hostname}:${port}`);
  });