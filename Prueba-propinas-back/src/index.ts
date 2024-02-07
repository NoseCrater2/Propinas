import express, { Request, Response } from 'express';
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});