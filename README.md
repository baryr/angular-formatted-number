angular-formatted-number
================
This module includes angular-formatted-number directive 

Features
------------
* Format numbers 123456789.12 -> 123'456'789.12 dynamically adding thousand separator while typing

Demo
------------
Download and open dist\index.html demo page


Usage
------------

JavaSscript
```
// Setup dependency
angular.module('app', ['baryr.formattedNumber']);
```

HTML
```
<input formatted-number ng-model="value" />
<input formatted-number thousand-separator="'" ng-model="value" />  // with custom separator (by default ')
<input formatted-number thousand-separator="'" ng-model="value" decimal-places="3"/>  // with custom separator (by default 2)

```

Prerequisites for Dev and Test
------------
Install required tooling (tested on node v7.5.0 and npm 4.1.2):
* npm install -g karma
* npm install -g karma-cli
* npm install -g karma-jasmine
* npm install -g phantomjs
* npm install -g karma-phantomjs-launcher
* npm install -g protractor
* webdriver-manager update

Download:
* npm start (to run local server)
* npm test (to run karma tests)
* npm run protractor (to run protractor test)

Changelog
------------
* 1.0.0
    - Initial version
