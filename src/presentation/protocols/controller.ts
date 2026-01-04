import { HttpRequest, HttpResponse } from '@/presentation';

export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
