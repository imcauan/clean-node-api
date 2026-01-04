import { Authentication, AuthenticationModel } from '@/domain/usecases';
import {
  HashComparer,
  TokenEncrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenEncrypter: TokenEncrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
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
