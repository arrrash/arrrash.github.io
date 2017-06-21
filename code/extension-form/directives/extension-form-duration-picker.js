'use strict';

(function() {

    var app = angular.module('ocContent');


    app.directive('durationPicker', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-duration-picker.html'
        };
    }]);

})();