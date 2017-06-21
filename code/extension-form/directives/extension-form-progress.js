'use strict';


var app = angular.module('ocContent');


app.directive('extensionFormProgress', [function() {

    return {
        restrict: 'E',
        templateUrl: 'app/src/extension-form/templates/extension-form-progress.html'
    };
}]);