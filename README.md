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

```Javascript
// Setup dependency
angular.module('app', ['baryr.formattedNumber']);
```

```html
<input formatted-number ng-model="value" />                         // with default \` separator
<input formatted-number thousand-separator="`" ng-model="value" />  // with custom separator
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
