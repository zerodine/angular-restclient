angular
    .module('restclient')
    .provider('api', ApiProvider);

/**
 * The provider to get the api
 * @constructor
 */
function ApiProvider() {
    /**
     * All the endpoints
     * @type {object}
     */
    this.endpoints = {};

    /**
     * The base route to the backend api
     * @type {string}
     */
    this.baseRoute = "";

    /**
     * Prefix of a header in a HEAD response
     * @type {string}
     */
    this.headResponseHeaderPrefix = "";

    /**
     * Set the base route
     * @param {string} baseRoute
     */
    this.baseRoute = function(baseRoute) {
        this.baseRoute = baseRoute;
    };

    /**
     * Set the head response header prefix
     * @param {string} headResponseHeaderPrefix
     */
    this.headResponseHeaderPrefix = function(headResponseHeaderPrefix) {
        this.headResponseHeaderPrefix = headResponseHeaderPrefix;
    };

    /**
     * Add an endpoint to the endpoint array
     * @param {string} endpoint
     */
    this.endpoint = function(endpoint) {
        var endpointConfig = new EndpointConfig();
        this.endpoints[endpoint] = endpointConfig;
        return endpointConfig;
    };

    /**
     * The factory method
     * @param {$injector} $injector
     * @ngInject
     */
    this.$get = function($injector) {
        var self = this;
        var api = {};

        // Go thru every given endpoint
        angular.forEach(self.endpoints, function (endpointConfig, name) {

            // Check if an container is given and if not, set it to the name of the endpoint
            if (angular.isFunction(endpointConfig.container)) endpointConfig.container = name;

            // Check if headResponseHeaderPrefix is set
            if (angular.isFunction(self.headResponseHeaderPrefix)) delete self.headResponseHeaderPrefix;

            if (angular.isFunction(endpointConfig.fixture)) {
                api[name] = new Endpoint(name, endpointConfig, self.baseRoute, self.headResponseHeaderPrefix, $injector);
            } else {
                api[name] = new EndpointFixture(name, endpointConfig, $injector);
            }
        });

        return api;
    };
}