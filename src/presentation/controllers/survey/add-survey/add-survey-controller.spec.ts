import { HttpRequest, AddSurveyController } from '@/presentation';
import { Validation } from '@/validation';

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
};

function makeSut(): SutTypes {
  const validationStub = makeValidationStub();
  const sut = new AddSurveyController(validationStub);

  return {
    sut,
    validationStub,
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
});
