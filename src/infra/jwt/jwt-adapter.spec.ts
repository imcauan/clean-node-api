import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

describe('JwtAdapter', () => {
  it('should call sign with correct values', async () => {
    // Arrange
    const sut = new JwtAdapter('secret');
    const signSpy = jest.spyOn(jwt, 'sign');

    // Act
    await sut.encrypt('any_value');

    // Assert
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret');
  });
});
