import { InvalidParamError } from '../../presentation/errors/invalid-param-error';
import { CompareFieldsValidation } from './compare-fields-validation';

type SutTypes = {
  sut: CompareFieldsValidation;
};

function makeSut(): SutTypes {
  const sut = new CompareFieldsValidation('field', 'fieldToCompare');
  return { sut };
}

describe('CompareFieldsValidation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const error = sut.validate({
      field: 'value1',
      fieldToCompare: 'value2',
    });

    // Assert
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('should not return if validation succeeds', () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    // Assert
    expect(error).toBeFalsy();
  });
});
