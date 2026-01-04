import { DbAuthentication } from '@/data';
import { Authentication } from '@/domain';
import { BcryptAdapter, AccountMongoRepository, JwtAdapter } from '@/infra';
import env from '@/main/config/env';

export function makeDbAuthentication(): Authentication {
  const salt = 12;
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
}
