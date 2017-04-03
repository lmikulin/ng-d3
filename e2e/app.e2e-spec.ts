import { NgD3Page } from './app.po';

describe('ng-d3 App', () => {
  let page: NgD3Page;

  beforeEach(() => {
    page = new NgD3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
