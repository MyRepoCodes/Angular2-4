import { browser, by, element } from 'protractor';

export class OpsWebopsPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('sn-root h1')).getText();
  }
}