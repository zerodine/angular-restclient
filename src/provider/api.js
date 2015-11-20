angular
    .module('restclient')
    .provider('api', ApiProvider);

/**
 * AngularJD provider to provide the api
 *
 * @class
 */
function ApiProvider() {

    /**
     * All the endpoints
     *
     * @type {object}
     */
    this.endpoints = {};

    /**
     * The base route to the backend api
     *
     * @type {string}
     */
    this.baseRoute = "";

    /**
     * Prefix of a header in a HEAD response
     *
     * @type {string}
     */
    this.headResponseHeaderPrefix = "";

    /**
     * Set the base route
     *
     * @param {string} baseRoute
     */
    this.baseRoute = function(baseRoute) {
        this.baseRoute = baseRoute;
    };

    /**
     * Set the head response header prefix
     *
     * @param {string} headResponseHeaderPrefix
     */
    this.headResponseHeaderPrefix = function(headResponseHeaderPrefix) {
        this.headResponseHeaderPrefix = headResponseHeaderPrefix;
    };

    /**
     * Add an endpoint to the endpoint array
     *
     * @param {string} endpoint
     */
    this.endpoint = function(endpoint) {
        var endpointConfig = new EndpointConfig(endpoint);
        this.endpoints[endpoint] = endpointConfig;
        return endpointConfig;
    };

    /**
     * The factory method
     *
     * @param {$injector} $injector
     * @ngInject
     */
    this.$get = function($injector) {
        var self = this;
        var api = {};

        // Go thru every given endpoint
        angular.forEach(self.endpoints, function (endpointConfig) {

            // Check if an container is given and if not, set it to the name of the endpoint
            if (angular.isFunction(endpointConfig.container)) endpointConfig.container = endpointConfig.name;

            // Check if headResponseHeaderPrefix is set
            if (angular.isFunction(self.headResponseHeaderPrefix)) delete self.headResponseHeaderPrefix;

            if (angular.isFunction(endpointConfig.baseRoute)) endpointConfig.baseRoute = self.baseRoute;
            endpointConfig.headResponseHeaderPrefix = self.headResponseHeaderPrefix;

            if (angular.isFunction(endpointConfig.mock)) {
                api[endpointConfig.name] = new Endpoint(endpointConfig, $injector);
            } else {
                api[endpointConfig.name] = new EndpointMock(endpointConfig, $injector);
            }
        });

        return api;
    };
}