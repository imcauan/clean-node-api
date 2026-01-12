import { Collection } from 'mongodb';
import { SurveyMongoRepository, MongoHelper } from '@/infra/database';
import env from '@/main/config/env';

function makeSut(): SurveyMongoRepository {
  return new SurveyMongoRepository();
}

let surveyCollection: Collection;

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should add a survey on success', async () => {
    // Arrange
    const sut = makeSut();

    // Act
    await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
        {
          answer: 'other_answer',
        },
      ],
    });

    // Assert
    const survey = await surveyCollection.findOne({ question: 'any_question' });
    expect(survey).toBeTruthy();
  });
});
