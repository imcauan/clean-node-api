import { AddSurvey, AddSurveyModel } from '@/domain';
import { HttpRequest, AddSurveyController, badRequest } from '@/presentation';
import { Validation } from '@/validation';

function makeAddSurvey(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return null;
    }
  }

  return new AddSurveyStub();
}

function makeValidationStub(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
}

function makeHttpRequest(): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
    },
  };
}

type SutTypes = {
  validationStub: Validation;
  sut: AddSurveyController;
  addSurveyStub: AddSurvey;
};

function makeSut(): SutTypes {
  const validationStub = makeValidationStub();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub,
  };
}

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    // Arrange
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeHttpRequest();

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation fails', async () => {
    // Arrange
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    // Act
    const result = await sut.handle(makeHttpRequest());

    // Assert
    expect(result).toEqual(badRequest(new Error()));
  });

  it('should call AddSurvey with correct values', async () => {
    // Arrange
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    const httpRequest = makeHttpRequest();

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
