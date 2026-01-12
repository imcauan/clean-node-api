import { DbAddSurvey } from '@/data';
import { SurveyMongoRepository } from '@/infra';

export function makeDbAddSurvey(): DbAddSurvey {
  const surveyMongoRepository = new SurveyMongoRepository();

  return new DbAddSurvey(surveyMongoRepository);
}
