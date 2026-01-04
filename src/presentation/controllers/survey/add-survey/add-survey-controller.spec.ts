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

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    // Arrange
    const validationStub = makeValidationStub();
    const validationSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeHttpRequest();
    const sut = new AddSurveyController(validationStub);

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
