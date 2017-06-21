'use strict';

(function() {

    var app = angular.module('ocContent');


    app.directive('extensionFormPopup', [function() {

        return {
            restrict: 'E',
            templateUrl: 'app/src/extension-form/templates/extension-form-popup.html'
        };
    }]);

})();