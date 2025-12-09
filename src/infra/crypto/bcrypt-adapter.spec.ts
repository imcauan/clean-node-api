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
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hash on success', async () => {
    const { sut } = makeSut();

    const result = await sut.encrypt('any_value');

    expect(result).toBe('hashed_value');
  });

  it('should throw if bcrypt throws', async () => {
    const { sut } = makeSut();

    const result = await sut.encrypt('any_value');

    expect(result).toBe('hashed_value');
  });
});
