import { Decrypter, TokenEncrypter } from '@/data';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements TokenEncrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(id: string): Promise<string> {
    const accessToken = jwt.sign({ id }, this.secret);
    return accessToken;
  }

  async decrypt(value: string): Promise<string> {
    jwt.verify(value, this.secret);
    return null;
  }
}
