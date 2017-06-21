'use strict';

(function() {

    var app = angular.module('ocContent');

    /**
     Converts unix dates to humanized dates
     */
    app.filter('momentToDate', function() {
        return function(timestamp) {
            moment.lang('en', {
                longDateFormat: {
                    LT: 'HH:mm',
                    LTS: 'HH:mm:ss',
                    L: 'DD/MM/YYYY',
                    LL: 'D MMMM YYYY',
                    LLL: 'D MMMM YYYY HH:mm',
                    LLLL: 'dddd D MMMM YYYY HH:mm'
                },
            });
            return moment(timestamp).format('LL');
        };
    });

})();