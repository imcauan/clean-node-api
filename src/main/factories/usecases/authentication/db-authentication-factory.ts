import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication';
import { Authentication } from '../../../../domain/usecases/authentication';
import { BcryptAdapter } from '../../../../infra/crypto/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository';
import { JwtAdapter } from '../../../../infra/jwt/jwt-adapter';
import env from '../../../config/env';

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
