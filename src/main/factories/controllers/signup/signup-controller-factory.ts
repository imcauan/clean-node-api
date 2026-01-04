import { SignUpController, Controller } from '@/presentation';
import {
  makeSignUpValidation,
  makeDbAuthentication,
  makeDbAddAccount,
  makeLogControllerDecorator,
} from '@/main/factories';

export function makeSignUpController(): Controller {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );

  return makeLogControllerDecorator(controller);
}
