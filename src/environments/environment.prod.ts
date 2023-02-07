// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const mobileOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
];

const url = window.location.href;
const formatUrl = new URL(url);
export const env = formatUrl.origin.includes('dev.')
  ? '.dev'
  : formatUrl.origin.includes('valid.')
  ? '.valid'
  : '';
const isMobile = mobileOrigins.includes(formatUrl.origin);
export const environment = {
  production: true,
  api: isMobile ? 'https://auth-nova.tic-nova.com/api' : '/api',
  code: 'aut',
  env: env === '.dev' ? 'DEV' : env === '.valid' ? 'VALID' : 'PROD',
  services: {
    i18n: {
      url: `https://i18n-nova${env}.tic-nova.com/api`,
    },
    tms: {
      url: `https://tms-nova${env}.tic-nova.com/api`,
    },
  },
};
