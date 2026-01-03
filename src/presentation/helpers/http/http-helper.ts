import { ServerError } from '../../errors/server-error';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { HttpResponse } from '../../protocols/http';

export function badRequest(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error,
  };
}

export function forbidden(error: Error): HttpResponse {
  return {
    statusCode: 403,
    body: error,
  };
}

export function serverError(error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(error.stack),
  };
}

export function ok<T>(data: T): HttpResponse {
  return {
    statusCode: 200,
    body: data,
  };
}

export function unauthorized(): HttpResponse {
  return {
    statusCode: 401,
    body: new UnauthorizedError(),
  };
}
