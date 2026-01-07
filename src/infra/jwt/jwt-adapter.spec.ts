import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/jwt';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },
  async verify(): Promise<string> {
    return 'any_value';
  },
}));

type SutTypes = {
  sut: JwtAdapter;
};

function makeSut(): SutTypes {
  const sut = new JwtAdapter('secret');

  return {
    sut,
  };
}

describe('JwtAdapter', () => {
  describe('sign', () => {
    it('should call sign with correct values', async () => {
      // Arrange
      const { sut } = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');

      // Act
      await sut.encrypt('any_value');

      // Assert
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret');
    });

    it('should return a token on sign success', async () => {
      // Arrange
      const { sut } = makeSut();

      // Act
      const result = await sut.encrypt('any_value');

      // Assert
      expect(result).toBe('any_token');
    });

    it('should throw if sign throws', async () => {
      // Arrange
      const { sut } = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });

      // Act
      const result = sut.encrypt('any_value');

      // Assert
      expect(result).rejects.toThrow();
    });
  });

  describe('verify', () => {
    it('should call verify with correct values', async () => {
      // Arrange
      const { sut } = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');

      // Act
      await sut.decrypt('any_token');

      // Assert
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    it('should return a value on verify success', async () => {
      // Arrange
      const { sut } = makeSut();

      // Act
      const result = await sut.decrypt('any_value');

      // Assert
      expect(result).toBe('any_value');
    });
  });
});
