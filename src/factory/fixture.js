angular
    .module('restclient')
    .factory('Fixture', FixtureFactory);

/**
 * The factory to get the abstract fixture
 * @constructor
 * @ngInject
 */
function FixtureFactory() {
    function FixtureFactory() {
    }

    FixtureFactory.prototype.routes = function(routes) {
        this.routeMatcher = {};

        for (var route in routes) {
            this.routeMatcher[route.match(/\[(GET|POST|PUT|DELETE|PATCH|HEAD)\]/)[1] + (route.match(/:/g) || []).length]= routes[route];
        }
    };

    FixtureFactory.prototype.fetch = function(method, params) {
        if (angular.isDefined(this.routeMatcher[method+params.length])) {
            this[this.routeMatcher[method+params.length]].apply(this, params);
        }
    };

    return FixtureFactory;
}