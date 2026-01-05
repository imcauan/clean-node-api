import { AccessDeniedError, forbidden } from '@/presentation';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';

describe('Auth Middleware', () => {
  it('should return 403 if authorization does not exist in headers', async () => {
    // Arrange
    const sut = new AuthMiddleware();

    // Act
    const result = await sut.handle({});

    // Assert
    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });
});
