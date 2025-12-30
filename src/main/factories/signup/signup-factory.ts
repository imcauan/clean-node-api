import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository';
import { Controller } from '../../../presentation/protocols/controller';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository';
import { makeSignUpValidation } from './signup-validation-factory';

export function makeSignUpController(): Controller {
  const salt = 12;

  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
  );

  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
}
