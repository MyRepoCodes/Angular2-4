// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  name: 'development',
  baseUrl: 'http://localhost',
  loginUrl: 'http://localhost/Core/login?site=serverweb&url=',
  encodingUrl: 'http://localhost:63201/api',
  ticketUrl: 'http://localhost:3000',
  topBarColor: '#878a8c',
  version: '2.0.14'
};
