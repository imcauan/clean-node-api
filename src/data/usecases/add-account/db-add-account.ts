import { AccountModel } from '../../../domain/models/account';
import {
  AddAccount,
  AddAccountModel,
} from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/account/add-account-repository';
import { Hasher } from '../../protocols/crypto/hasher';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly Hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.Hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
