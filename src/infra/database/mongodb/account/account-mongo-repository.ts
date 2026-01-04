import { ObjectId } from 'mongodb';
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols';
import { AccountModel, AddAccountModel } from '@/domain';
import { MongoHelper, MongoHelperMapCollection } from '@/infra/database';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
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

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }
}
