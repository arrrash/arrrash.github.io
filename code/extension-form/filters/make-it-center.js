'use strict';

(function() {

    var app = angular.module('ocContent');


    app.directive('vcenter', ['$window', function($window) {

        return function(scope, element, attrs) {
            var w = angular.element($window);
            var offset = 0;
            scope.getWindowDimensions = function() {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            if (attrs.offset) {
                offset = parseInt(attrs.offset);
            }
            scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;
                scope.top = (scope.windowHeight - element[0].offsetHeight) / 2;
                // element.height(scope.windowHeight);
                element.position('relative');
                if (offset !== 0) {
                    if (scope.top > offset) {
                        element.offset({ top: scope.top });

                    } else {
                        element.offset({ top: offset });
                        element[0].style.marginBottom = offset + 'px';

                    }
                } else {
                    element.offset({ top: scope.top });
                }
            }, true);

            w.bind('vcenter', function() {
                scope.$apply();
            });



        };
    }]);

})();