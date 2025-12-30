import { HashComparer } from '../../data/protocols/crypto/hash-comparer';
import { Hasher } from '../../data/protocols/crypto/hasher';
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, passwordHash);
    return isValid;
  }
}
