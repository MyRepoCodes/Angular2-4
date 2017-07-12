// import {
//   addProviders,
//   inject
// } from '@angular/core/testing';
//
// // Load the implementations that should be tested
// import { AppSettingsService } from './app-settings.service';
//
// describe('AppSettingsService', () => {
//   // provide our implementations or mocks to the dependency injector
//   beforeEach(() => addProviders([
//     AppSettingsService
//   ]));
//
//   it('baseUrl', inject([AppSettingsService], (settings: AppSettingsService) => {
//     expect(settings.getBaseUrl()).toEqual('http://localhost');
//   }));
//
//   it('loginUrl', inject([AppSettingsService], (settings: AppSettingsService) => {
//     expect(settings.getLoginUrl('test')).toEqual('http://localhost/Core/login?site=serverweb&url=test');
//   }));
//
//   it('encodingUrl', inject([AppSettingsService], (settings: AppSettingsService) => {
//     expect(settings.getEncodingBaseUrl()).toEqual('http://localhost:63201/api');
//   }));
//
// });
