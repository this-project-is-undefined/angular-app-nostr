import type { Environment } from './utils';
import { EnvConfig } from './utils';

export const environment: Environment = {
  configuration: EnvConfig.development,
  api: 'http://localhost:3000',
};
