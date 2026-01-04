import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../../infra/crypto/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository';

export function makeDbAddAccount(): DbAddAccount {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
}
