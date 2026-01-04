import { Express } from 'express';
import { bodyParser } from '@/main/middlewares/body-parser';
import { contentType } from '@/main/middlewares/content-type';
import { cors } from '@/main/middlewares/cors';

export default (app: Express): void => {
  app.use(cors);
  app.use(contentType);
  app.use(bodyParser);
};
