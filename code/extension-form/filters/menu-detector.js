'use strict';

(function() {

    var app = angular.module('ocContent');


    app.directive('menuType', ['localStorageFactory', '$q', function(localStorageFactory, $q) {

        return function(scope, element) {

            function success(data) {
                scope.menuType = data[0][0][0].menu_type;
            }
            var allPromises = $q.all([localStorageFactory.get('userProfile')]);
            allPromises.then(success);


        };
    }]);

})();