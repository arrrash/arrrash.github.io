'use strict';

(function() {

    var app = angular.module('ocContent');


    app.service('extensionFormSrv', ['$http', '$q', function extensionFormSrv($http, $q) {

        var apiUrl = '';
        var AccessToken = '';

        function handleError(response) {
            if (!angular.isObject(response.data) || !response.data.message) {
                return ($q.reject('An unknown error occurred.'));
            }
            return ($q.reject(response.data.message));
        }

        function handleSuccess(response) {
            // console.log('in service', response);
            if (response.config.url === 'api/web/user/api-token') {
                AccessToken = response.data.access_token;
            }

            if (response.config.url === 'api/web/user/api-token') {
                apiUrl = response.data.sws_extension_url;
            }
            return (response.data);
        }

        function getToken() {
            var request = $http({
                method: 'GET',
                url: 'api/web/user/api-token',

            });
            return (request.then(handleSuccess, handleError));
        }

        function getEnrolementDetails(studentNo) {
            var request = $http({
                method: 'GET',
                url: apiUrl + '/api/enrolment-details/applicant/' + studentNo,
                headers: {
                    'x-access-token': 'token',
                    'Access-Token': AccessToken
                }

            });
            return (request.then(handleSuccess, handleError));
        }

        function saveEnrolementDetails(data) {

            var request = $http({
                method: 'POST',
                data: data,
                url: apiUrl + '/api/extension-applications',
                headers: {
                    'Access-Token': AccessToken,
                    'Content-Type': 'application/json'
                },

            });
            return (request.then(handleSuccess, handleError));
        }

        function cancelApplication(applicationNo) {

            var request = $http({
                method: 'GET',
                url: apiUrl + '/api/extension-applications/applicationNo/' + applicationNo + '/cancel',
                headers: {
                    'Access-Token': AccessToken,
                    'Content-Type': 'application/json'
                },

            });
            return (request.then(handleSuccess, handleError));
        }



        function getReasons() {
            var request = $http({
                method: 'get',
                url: apiUrl + '/api/extension-reasons',

            });
            return (request.then(handleSuccess, handleError));
        }




        return ({

            getToken: getToken,

            getEnrolementDetails: getEnrolementDetails,
            getReasons: getReasons,
            saveEnrolementDetails: saveEnrolementDetails,
            cancelApplication: cancelApplication,


        });

    }]);
})();