import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/crypto/hash-comparer';
import { TokenEncrypter } from '../../protocols/crypto/token-encrypter';
import { LoadAccountByEmailRepository } from '../../protocols/database/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/database/update-access-token-repository';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenEncrypter: TokenEncrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email,
    );

    if (!account) {
      return null;
    }

    const isValid = await this.hashComparer.compare(
      authentication.password,
      account.password,
    );

    if (!isValid) {
      return null;
    }

    const accessToken = await this.tokenEncrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken,
    );

    return accessToken;
  }
}
