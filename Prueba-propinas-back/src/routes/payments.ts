import { Router, Request, Response } from 'express';
import { Payment } from '../models/payment';

const router = Router();
let payments: Payment[] = [];

router.get('/', (req: Request, res: Response) => {
  res.json(payments);
});

router.post('/', (req: Request, res: Response) => {
  const payment: Payment = {
    id: payments.length + 1,
    amount: req.body.amount,
    type: req.body.type,
  };

  payments.push(payment);
  res.json(payments);
});

router.delete('/:id', (req: Request, res: Response) => {
  const index = payments.findIndex((p) => p.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send('Payment not found');
  } else {
    payments.splice(index, 1);
    res.json(payments);
  }
});
export default router;