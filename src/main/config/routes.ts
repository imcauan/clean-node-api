import { Express, Router } from 'express';
import fs from 'fs';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  fs.readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
