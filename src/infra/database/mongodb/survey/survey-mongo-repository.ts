import { AddSurveyRepository } from '@/data';
import { AddSurveyModel } from '@/domain';
import { MongoHelper } from '@/infra/database/mongodb/helpers';

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.insertOne(data);
  }
}
