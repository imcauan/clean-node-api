export interface TokenEncrypter {
  encrypt(id: string): Promise<string>;
}
