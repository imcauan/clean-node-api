import { MissingParamError } from '../../errors/missing-param-error';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredFieldValidation', () => {
  it('should return a MissingParamError if validation fails', () => {
    // Arrange
    const sut = new RequiredFieldValidation('any_field');

    // Act
    const error = sut.validate({
      name: 'any_name',
    });

    // Assert
    expect(error).toEqual(new MissingParamError('any_field'));
  });
});
