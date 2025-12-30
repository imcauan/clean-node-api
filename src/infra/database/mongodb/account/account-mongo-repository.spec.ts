import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

function makeSut(): AccountMongoRepository {
  return new AccountMongoRepository();
}

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an account on add success', async () => {
    // Arrange
    const sut = makeSut();

    // Act
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    });

    // Assert
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@email.com');
    expect(account.password).toBe('any_password');
  });

  it('should return an account on loadByEmail success', async () => {
    // Arrange
    const sut = makeSut();
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    });

    // Act
    const account = await sut.loadByEmail('any_email@email.com');

    // Assert
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@email.com');
    expect(account.password).toBe('any_password');
  });

  it('should return null if loadByEmail fails', async () => {
    // Arrange
    const sut = makeSut();

    // Act
    const account = await sut.loadByEmail('any_email@email.com');

    // Assert
    expect(account).toBeFalsy();
  });

  it('should update the account accessToken on updateAccessToken success', async () => {
    // Arrange
    const sut = makeSut();
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    });

    // Act
    await sut.updateAccessToken(result.insertedId.toHexString(), 'any_token');

    const account = await accountCollection.findOne({
      _id: result.insertedId,
    });

    // Assert
    expect(account).toBeTruthy();
    expect(account.accessToken).toBe('any_token');
  });
});
