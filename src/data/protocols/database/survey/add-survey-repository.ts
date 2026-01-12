import { AddSurveyModel } from '@/domain';

export interface AddSurveyRepository {
  add(data: AddSurveyModel): Promise<void>;
}
