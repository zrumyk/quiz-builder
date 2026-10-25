import express from 'express';
import cors from 'cors';
import config from './configuration/config.js';
import router from './routes/index.js';
import errorMiddleware from './middleware/error.middleware.js';

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

app.use(router);
app.use(errorMiddleware);

app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
