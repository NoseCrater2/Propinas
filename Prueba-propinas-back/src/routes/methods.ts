import { Router, Request, Response } from 'express';
import { Method } from '../models/method';

const router = Router();
const methods: Method[] = [
  {
    id: 1,
    name: 'Efectivo',
  },
  {
    id: 2,
    name: 'BBVA 123',
  },
  {
    id: 3,
    name: 'Santander 123',
  },
];

router.get('/', (req: Request, res: Response) => {
  res.json(methods);
});
export default router;