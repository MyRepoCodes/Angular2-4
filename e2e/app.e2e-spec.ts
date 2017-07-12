import { OpsWebopsPage } from './app.po';

describe('ops-webops App', () => {
  let page: OpsWebopsPage;

  beforeEach(() => {
    page = new OpsWebopsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('sn works!');
  });
});
