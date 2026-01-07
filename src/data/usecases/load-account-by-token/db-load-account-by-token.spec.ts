import {
  Decrypter,
  DbLoadAccountByToken,
  LoadAccountByTokenRepository,
} from '@/data';
import { AccountModel } from '@/domain';

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  };
}

function makeLoadAccountByTokenRepository() {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByTokenRepositoryStub();
}

function makeDecrypter() {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return 'any_value';
    }
  }

  return new DecrypterStub();
}

type SutTypes = {
  decrypterStub: Decrypter;
  sut: DbLoadAccountByToken;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

function makeSut(): SutTypes {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  );

  return {
    decrypterStub,
    sut,
    loadAccountByTokenRepositoryStub,
  };
}

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    // Act
    await sut.load('any_token', 'any_role');

    // Assert
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  it('should return null if Decrypter returns null', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null);

    // Act
    const result = await sut.load('any_token', 'any_role');

    // Assert
    expect(result).toBeNull();
  });

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    // Arrange
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    );

    // Act
    await sut.load('any_token', 'any_role');

    // Assert
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    // Arrange
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(null);

    // Act
    const result = await sut.load('any_token', 'any_role');

    // Assert
    expect(result).toBeNull();
  });

  it('should return an account on success', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const result = await sut.load('any_token', 'any_role');

    // Assert
    expect(result).toEqual(makeFakeAccount());
  });
});
