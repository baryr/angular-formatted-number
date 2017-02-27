angular-formatted-number
================
This module includes angular-formatted-number directive 

Features
------------
* Format numbers 123456789.12 -> 123\`456\`789.12 dynamically adding thousand separator while typing

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
<input formatted-number thousand-separator="`" ng-model="value" />  // with custom separator (by default \`)
<input formatted-number thousand-separator="`" ng-model="value" decimal-places="3"/>  // with custom separator (by default 2)

```

Tests
------------
Download:
* npm start (to run local server)
* npm test (to run karma tests)
* npm run protractor (to run protractor test)

Changelog
------------
* 1.0
	- Initial version
