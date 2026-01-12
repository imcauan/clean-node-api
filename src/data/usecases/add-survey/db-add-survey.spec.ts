import { AddSurveyRepository } from '@/data';
import { DbAddSurvey } from '@/data/usecases/add-survey/db-add-survey';
import { AddSurveyModel } from '@/domain';

function makeFakeSurveyData(): AddSurveyModel {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  };
}

function makeAddSurveyRepository() {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyModel): Promise<void> {
      return null;
    }
  }

  return new AddSurveyRepositoryStub();
}

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

function makeSut(): SutTypes {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
}

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    // Arrange
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();

    // Act
    await sut.add(surveyData);

    // Assert
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('should throw if AddSurveyRepository throws', async () => {
    // Arrange
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest
      .spyOn(addSurveyRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const surveyData = makeFakeSurveyData();

    // Act
    const result = sut.add(surveyData);

    // Assert
    expect(result).rejects.toThrow();
  });
});
