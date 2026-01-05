import { AccountModel } from '@/domain';

export interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<AccountModel>;
}
