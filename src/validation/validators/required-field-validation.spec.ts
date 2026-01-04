import { MissingParamError } from '../../presentation/errors/missing-param-error';
import { RequiredFieldValidation } from './required-field-validation';

type SutTypes = {
  sut: RequiredFieldValidation;
};

function makeSut(): SutTypes {
  const sut = new RequiredFieldValidation('any_field');
  return { sut };
}

describe('RequiredFieldValidation', () => {
  it('should return a MissingParamError if validation fails', () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const error = sut.validate({
      name: 'any_name',
    });

    // Assert
    expect(error).toEqual(new MissingParamError('any_field'));
  });

  it('should not return if validation succeeds', () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const error = sut.validate({
      any_field: 'any_value',
    });

    // Assert
    expect(error).toBeFalsy();
  });
});
