import { Controller, LoginController } from '@/presentation';
import {
  makeLoginValidation,
  makeDbAuthentication,
  makeLogControllerDecorator,
} from '@/main/factories';

export function makeLoginController(): Controller {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );

  return makeLogControllerDecorator(controller);
}
