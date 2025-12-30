export interface HashComparer {
  compare(password: string, passwordHash: string): Promise<boolean>;
}
