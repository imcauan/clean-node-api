import { DbAddAccount } from '@/data';
import { BcryptAdapter, AccountMongoRepository } from '@/infra';

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
