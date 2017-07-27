'use strict';

const chai = require('chai');
const expect = chai.expect;
const RSVP = require('rsvp');
const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const request = require('request');
const get = RSVP.denodeify(request);
const post = RSVP.denodeify(request.post);

function injectMiddlewareAddon(app) {
  app.editPackageJSON(function(pkg) {
    pkg.devDependencies['body-parser'] = '1.17.2';
    pkg.dependencies = pkg.dependencies || {}
    pkg.dependencies['fastboot-express-middleware'] = '^1.0.0';
    pkg['ember-addon'] = {
      paths: [
        'lib/post-middleware'
      ]
    };
  });
  return app.run('npm', 'install')
}

describe('request details', function() {
  this.timeout(300000);

  let app;

  before(function() {
    app = new AddonTestApp();

    return app.create('request')
      .then(() => injectMiddlewareAddon(app))
      .then(function() {
        return app.startServer({
          command: 'serve'
        });
      });
  });

  after(function() {
    return app.stopServer();
  });

  // it('makes host available via a service', function() {
  //   return get({
  //     url: 'http://localhost:49741/show-host',
  //     headers: {
  //       'Accept': 'text/html'
  //     }
  //   })
  //     .then(function(response) {
  //       expect(response.body).to.contain('Host: localhost:49741');
  //       expect(response.body).to.contain('Host from Instance Initializer: localhost:49741');
  //     });
  // });

  // it('makes protocol available via a service', function() {
  //   return get({
  //     url: 'http://localhost:49741/show-protocol',
  //     headers: {
  //       'Accept': 'text/html'
  //     }
  //   })
  //     .then(function(response) {
  //       expect(response.body).to.contain('Protocol: http:');
  //       expect(response.body).to.contain('Protocol from Instance Initializer: http:');
  //     });
  // });

  // it('makes path available via a service', function() {
  //   return get({
  //     url: 'http://localhost:49741/show-path',
  //     headers: {
  //       'Accept': 'text/html'
  //     }
  //   })
  //     .then(function(response) {
  //       expect(response.body).to.contain('Path: /show-path');
  //       expect(response.body).to.contain('Path from Instance Initializer: /show-path');
  //     });
  // });

  // it('makes query params available via a service', function() {
  //   return get({
  //     url: 'http://localhost:49741/list-query-params?foo=bar',
  //     headers: {
  //       'Accept': 'text/html'
  //     }
  //   })
  //     .then(function(response) {
  //       expect(response.body).to.contain('Query Params: bar');
  //       expect(response.body).to.contain('Query Params from Instance Initializer: bar');
  //     });
  // });

  // it('makes cookies available via a service', function() {
  //   let jar = request.jar();
  //   let cookie = request.cookie('city=Cluj');

  //   jar.setCookie(cookie, 'http://localhost:49741');

  //   return get({
  //     url: 'http://localhost:49741/list-cookies',
  //     headers: {
  //       'Accept': 'text/html'
  //     },
  //     jar: jar
  //   })
  //     .then(function(response) {
  //       expect(response.body).to.contain('Cookies: Cluj');
  //       expect(response.body).to.contain('Cookies from Instance Initializer: Cluj');
  //     });
  // });

  it.only('makes headers available via a service', function() {
    return get({
      url: 'http://localhost:49741/list-headers',
      headers: {
        'X-FastBoot-info': 'foobar',
        'Accept': 'text/html'
      }
    })
      .then(function(response) {
        expect(response.body).to.contain('Headers: foobar');
        expect(response.body).to.contain('Headers from Instance Initializer: foobar');
      });
  });

  it.only('makes method available via a service', function() {
    return get({
      url: 'http://localhost:49741/show-method'
    })
      .then(function(response) {
        expect(response.body).to.contain('Method: GET');
        expect(response.body).to.contain('Method from Instance Initializer: GET');
      });
  });

  it('makes body available via a service', function() {
    return post({
      url: 'http://localhost:49741/show-body',
      form: 'TEST'
    })
      .then(function(response) {
        expect(response.body).to.contain('Body: TEST');
        expect(response.body).to.contain('Body from Instance Initializer: BODY');
      });
  });
});
