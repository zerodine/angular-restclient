/**
 * This class represents one configuration for an endpoint.
 *
 * @class
 */
function EndpointConfig(endpointName) {

    /**
     * Name of the endpoint
     *
     * @type {string}
     */
    this.name = endpointName;

    /**
     * Prefix of any custom headers
     *
     * @type {string}
     */
    this.headResponseHeaderPrefix = null;

    this.cache = false;
}

/**
 * Set the route to this endpoint
 *
 * @param {string} route The endpoint route defined as string
 * @return {EndpointConfig} Returns the endpoint config object
 */
EndpointConfig.prototype.route = function(route) {
    this.route = route;
    return this;
};

/**
 * Set the model that is used to transform the response
 *
 * @param {string} model The model defined as string
 * @return {EndpointConfig} Returns the endpoint config object
 */
EndpointConfig.prototype.model = function(model) {
    this.model = model;
    return this;
};

/**
 * Set the container that wraps the response. Default is null.
 *
 * @param {string} container The container defined as string
 * @return {EndpointConfig} Returns the endpoint config object
 */
EndpointConfig.prototype.container = function(container) {
    this.container = container;
    return this;
};

/**
 * Define if the response from the api is going to be an array
 *
 * @return {EndpointConfig} Returns the endpoint config object
 */
EndpointConfig.prototype.actions = function(actions) {
    this.actions = actions;
    return this;
};

/**
 * Overwrites the baseRoute from the global configuration
 *
 * @return {EndpointConfig} Returns the endpoint config object
 */
EndpointConfig.prototype.baseRoute = function(baseRoute) {
    this.baseRoute = baseRoute;
    return this;
};

/**
 * Overwrites the mock from the global configuration
 *
 * @return {EndpointConfig} Returns the endpoint config object
 */
EndpointConfig.prototype.mock = function(mock) {
    this.mock = mock;
    return this;
};