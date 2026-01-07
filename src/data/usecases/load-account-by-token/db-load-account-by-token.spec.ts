import { Decrypter, DbLoadAccountByToken } from '@/data';

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
};

function makeSut(): SutTypes {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);

  return {
    decrypterStub,
    sut,
  };
}

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    // Act
    await sut.load('any_token');

    // Assert
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
});
