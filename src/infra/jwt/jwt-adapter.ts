import { TokenEncrypter } from '../../data/protocols/crypto/token-encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements TokenEncrypter {
  constructor(private readonly secret: string) {}

  async encrypt(id: string): Promise<string> {
    jwt.sign({ id }, this.secret);
    return null;
  }
}
