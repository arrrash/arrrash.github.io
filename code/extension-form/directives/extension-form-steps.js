'use strict';

(function() {

    var app = angular.module('ocContent');


    app.directive('extensionFormIntro', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-intro.html'
        };
    }]);

    app.directive('extensionFormStep1', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-step1.html'
        };
    }]);


    app.directive('extensionFormStep2', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-step2.html',

        };
    }]);

    app.directive('extensionFormStep3', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-step3.html'
        };
    }]);

    app.directive('extensionFormStep4', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-step4.html'
        };
    }]);

    app.directive('extensionFormStep5', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-step5.html'
        };
    }]);

    app.directive('extensionFormStep6', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-step6.html'
        };
    }]);
    app.directive('extensionFormStep7', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-step7.html'
        };
    }]);
})();