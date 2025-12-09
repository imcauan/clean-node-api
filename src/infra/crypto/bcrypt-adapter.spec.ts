import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hashed_value');
  },
}));

type SutTypes = {
  sut: BcryptAdapter;
};

const salt = 12;
function makeSut(): SutTypes {
  return {
    sut: new BcryptAdapter(salt),
  };
}

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    // Arrange
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    // Act
    await sut.encrypt('any_value');

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hash on success', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const result = await sut.encrypt('any_value');

    // Assert
    expect(result).toBe('hashed_value');
  });

  it('should throw if bcrypt throws', async () => {
    // Arrange
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValue(Promise.reject(new Error()) as any);

    // Act
    const result = sut.encrypt('any_value');

    // Assert
    expect(result).rejects.toThrow();
  });
});
