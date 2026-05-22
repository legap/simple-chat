import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  apiUrl: '',
  wsUrl: `ws://${window.location.hostname}/ws`
};
