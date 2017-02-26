//jshint strict: false
exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    '*.protractor.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },
  
  chromeOnly: true,

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};