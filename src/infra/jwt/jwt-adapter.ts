import { TokenEncrypter } from '@/data/protocols';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements TokenEncrypter {
  constructor(private readonly secret: string) {}

  async encrypt(id: string): Promise<string> {
    const accessToken = jwt.sign({ id }, this.secret);
    return accessToken;
  }
}
