import { AddAccountRepository } from '../../../../data/protocols/database/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/database/load-account-by-email-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper, MongoHelperMapCollection } from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);

    return MongoHelper.map({
      _id: result.insertedId,
      ...accountData,
    });
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne<
      MongoHelperMapCollection<AccountModel>
    >({
      email,
    });

    if (!account) {
      return null;
    }

    return MongoHelper.map(account);
  }
}
