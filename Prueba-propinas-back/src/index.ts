import express, { Request, Response, NextFunction } from 'express';
import methodRoutes from './routes/methods';
import paymentRoutes from './routes/payments';
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


app.use('/api/methods', methodRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Propinas back');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send('Something went wrong');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});