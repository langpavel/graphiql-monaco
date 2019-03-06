import setupProxy from './setupProxy';

class ExpressMock {
  _use: { [url: string]: any } = {};
  use = jest.fn((url, fn) => (this._use[url] = fn));
  listen = jest.fn();
}

jest.doMock('express', () => ExpressMock);

it('proxy is configured', () => {
  const Express = require('express');
  const app = new Express();
  setupProxy(app);
  expect(app._use['/graphql']).toBeInstanceOf(Function);
});
