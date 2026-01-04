import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeAddSurveyController } from '@/main/factories';

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()));
};
