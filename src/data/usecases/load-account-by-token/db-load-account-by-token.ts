import { Decrypter, LoadAccountByTokenRepository } from '@/data';
import { AccountModel, LoadAccountByToken } from '@/domain';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);

    if (!token) {
      return null;
    }

    await this.loadAccountByTokenRepository.loadByToken(accessToken, role);

    return null;
  }
}
