'use strict';

    var app = angular.module('ocContent');

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('urlInterceptor');
});

app.factory('urlInterceptor', function ($location) {
    return {
        request: function (config) {
            //config = config || {};
            //console.log("RequestInterceptor Location: " + JSON.stringify($location) + " Request: " + JSON.stringify(config));
            return config;
        },
        requestError: function(config) {

            return config;
        },
        responseError: function(response) {
            console.log('Error in ' + response.config.method +': '+ response.config.url, 'api with Error Code' , response.status);
            var mockedResponse = {};

            if (response.config.url === 'api/web/get/message-centre/labels'){
                mockedResponse.data =
                    [{'role': 'trainer', 'label': 'educators'},
                     {'role': 'assessor', 'label': 'other'}];
                mockedResponse.message = 'resolved';
                mockedResponse.status = '200';

            } else {
                mockedResponse = response;
            }

            return mockedResponse;
        },

        response: function (response) {
            return response;
        }
    };
});