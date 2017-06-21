'use strict';

(function() {

    var app = angular.module('ocContent');

    app.directive('extensionForm', ['onboardingStepSrv', '$rootScope', '$window', function(onboardingStepSrv, $rootScope, $window) {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-wrapper.html',
            controller: 'extensionFormCtrl',
            transclude: true,
            link: function(scope, element, attrs) {


            }
        };
    }]);

})();