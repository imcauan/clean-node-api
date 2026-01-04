import { LogMongoRepository } from '@/infra';
import { Controller } from '@/presentation';
import { LogControllerDecorator } from '@/main';

export function makeLogControllerDecorator(
  controller: Controller,
): LogControllerDecorator {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
}
