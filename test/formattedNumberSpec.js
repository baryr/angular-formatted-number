describe("uiFormattedNumber", function () {
  "use strict";

  var inputHtml = "<input formatted-number name='input' ng-model='value' />";
  var compileElement, scope, config, timeout;

  beforeEach(module("baryr.formattedNumber"));

  beforeEach(function() {
    angular.module("test",[]);
    module("test");
  });

  beforeEach(inject(function ($rootScope, $compile, $timeout) {
    scope = $rootScope;
    compileElement = function(html) {
      return $compile(html)(scope);
    };
    timeout = $timeout;
  }));

  describe("initialization", function () {

    it("should format 123 as 123", function() {
      var input = compileElement(inputHtml);
      scope.$apply("value = '123'");
      expect(input.val()).toBe("123");
    });

    it("should format 1234 as 1'234", function() {
      var input = compileElement(inputHtml);
      scope.$apply("value = '1234'");
      expect(input.val()).toBe("1'234");
    });

    it("should format 12345 12'345", function() {
      var input = compileElement(inputHtml);
      scope.$apply("value = '12345'");
      expect(input.val()).toBe("12'345");
    });

    it("should format 1234567 1'234'567", function() {
      var input = compileElement(inputHtml);
      scope.$apply("value = '1234567'");
      expect(input.val()).toBe("1'234'567");
    });

    it("should format 1234567.12345 1'234'567.12", function() {
      var input = compileElement(inputHtml);
      scope.$apply("value = '1234567.12345'");
      expect(input.val()).toBe("1'234'567.12");
    });

  });

});
