import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository';
import { Controller } from '../../../presentation/protocols/controller';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';

export function makeLogControllerDecorator(
  controller: Controller,
): LogControllerDecorator {
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logMongoRepository);
}
