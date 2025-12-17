import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { LogMongoRepository } from './log-repository';

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  it('should create an error log on success', async () => {
    // Arrange
    const sut = new LogMongoRepository();

    // Act
    await sut.logError('any_error_stack');

    // Assert
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
