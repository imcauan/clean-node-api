import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hashed_value');
  },

  async compare(): Promise<boolean> {
    return true;
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
  it('should call hash with correct values', async () => {
    // Arrange
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    // Act
    await sut.hash('any_value');

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a valid hash on hash success', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const result = await sut.hash('any_value');

    // Assert
    expect(result).toBe('hashed_value');
  });

  it('should call compare with correct values', async () => {
    // Arrange
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'compare');

    // Act
    await sut.compare('any_value', 'any_hash');

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  it('should throw if bcrypt throws', async () => {
    // Arrange
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValue(Promise.reject(new Error()) as any);

    // Act
    const result = sut.hash('any_value');

    // Assert
    expect(result).rejects.toThrow();
  });
});
