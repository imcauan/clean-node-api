import { MongoHelper as sut } from './mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it('should reconnect if mongodb is down', async () => {
    // Arrange & Act
    let accountCollection = await sut.getCollection('accounts');

    // Assert
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();

    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
