//jshint strict: false
module.exports = function(config) {
  config.set({

	basePath: './',

	files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/formatted-number.js',
      'test/*Spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    //browsers: ['Chrome'],
	browsers: ['PhantomJS'],

	plugins : ['karma-jasmine', 'karma-phantomjs-launcher'],
    //plugins: ['karma-chrome-launcher', 'karma-firefox-launcher', 'karma-jasmine', 'karma-junit-reporter' ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
