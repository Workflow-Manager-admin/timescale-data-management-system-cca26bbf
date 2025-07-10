import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger';

// Initialize express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Serve swagger docs with dynamic server URL
app.use('/docs', swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
  const host = req.get('host') || '';
  let protocol = req.protocol;
  const actualPort = (req.socket as any).localPort || 80;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = (req.secure ? 'https' : protocol);

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

export default app;
