angular
    .module('restclient')
    .factory('Mock', MockFactory);

/**
 * The factory to get the abstract mock
 * @constructor
 * @ngInject
 */
function MockFactory() {
    function Mock() {}

    Mock.prototype.routes = function(routes) {
        this.routeMatcher = {};

        for (var route in routes) {
            if (!routes.hasOwnProperty(route)) continue;

            this.routeMatcher[route.match(/\[(GET|POST|PUT|DELETE|PATCH|HEAD)\]/)[1] + (route.match(/:/g) || []).length]= routes[route];
        }
    };

    Mock.prototype._request = function(method, params, body) {
        if (angular.isDefined(this.routeMatcher[method+params.length])) {
            var methodName = method+params.length;
            if (angular.isDefined(body)) params.push({ body: body});

            return this.routeMatcher[methodName].apply(this, params);
        }
    };

    return Mock;
}