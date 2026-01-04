import { makeAddSurveyValidation } from '@/main';
import {
  RequiredFieldValidation,
  ValidationComposite,
  Validation,
} from '@/validation';

jest.mock('../../../../validation/validators/validation-composite');

describe('Add Survey Validation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    // Arrange & Act
    makeAddSurveyValidation();
    const validations: Validation[] = [];

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }

    // Assert
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
