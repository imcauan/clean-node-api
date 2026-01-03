import { Controller } from '../../../../presentation/protocols/controller';
import { makeLoginValidation } from './login-validation-factory';
import { LoginController } from '../../../../presentation/controllers/login/login-controller';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export function makeLoginController(): Controller {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );

  return makeLogControllerDecorator(controller);
}
