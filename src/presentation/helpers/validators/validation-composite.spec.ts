import { MissingParamError } from '../../errors/missing-param-error';
import { Validation } from './validation';
import { ValidationComposite } from './validation-composite';

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    // Arrange
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return new MissingParamError('field');
      }
    }

    const sut = new ValidationComposite([new ValidationStub()]);

    // Act
    const error = sut.validate({ field: 'any_value' });

    // Assert
    expect(error).toEqual(new MissingParamError('field'));
  });
});
