angular.module('projectServices', ['ngResource'])
        .factory('Project', function($resource) {
            return $resource('http://194.102.62.138:8080/sct-restapi/rest/', {}, {
            query: {method: 'GET', isArray: true},
            save: {method:'POST'}
        });
        });
