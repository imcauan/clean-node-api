import { HttpRequest, HttpResponse } from '@/presentation';

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
