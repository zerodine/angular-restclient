angular.extend(Endpoint.prototype, EndpointAbstract.prototype);

/**
 * Class representing an Endpoint with all the functionality for receiving, saving and updating data from the backend
 *
 * @param {EndpointConfig} endpointConfig Config of the endpoint which was defined earlier
 * @param {$injector} $injector The Angular $injector factory
 * @constructor Endpoint
 */
function Endpoint(endpointConfig, $injector) {
    var self = this;

    /**
     * The EndpointConfig object defined for this endpoint
     * @type {EndpointConfig}
     */
    this.endpointConfig = endpointConfig;

    /**
     * An instance if the $resource factory from the angularjs library
     * @type {$resource}
     */
    this.resource = $injector.get('$resource')(this.endpointConfig.baseRoute + this.endpointConfig.route, {}, merge({
        get: {
            method: 'GET',
            transformResponse: function(data, headers, status) {
                data = angular.fromJson(data);
                if (status >= 400) return data;

                return {
                    result: self.mapResult(angular.fromJson(data)),
                    pagination: self.getPagination(data)
                };
            }
        },
        save: {
            method: 'POST',
            transformResponse: function(data, headers, status) {
                data = angular.fromJson(data);
                if (status >= 400) return data;

                return {result: self.mapResult(data)};
            }
        },
        update: {
            method: 'PUT',
            transformResponse: function(data, headers, status) {
                data = angular.fromJson(data);
                if (status >= 400) return data;

                return {result: self.mapResult(data)};
            }
        },
        head: {
            method: 'HEAD'
        },
        remove: {
            method: 'DELETE'
        }
    }, endpointConfig.actions));

    /**
     * An instance if the $log factory from the angularjs library
     * @type {$log}
     */
    this.log = $injector.get('$log');

    /**
     * An instance if the $injector factory from the angularjs library
     * @type {$injector}
     */
    this.injector = $injector;

    /**
     * An instance if the $q factory from the angularjs library
     * @type {$q}
     */
    this.q = $injector.get('$q');
}

/**
 * Call an endpoint and map the response to one or more models given in the endpoint config
 * The server response must be an object
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters
 * @return {Promise<Model|Error>}
 * @memberof Endpoint
 */
Endpoint.prototype.get = function (params) {
    var self = this;
    var defer = self.q.defer();

    this.resource.get(params, function(data) {
        data.result.pagination = data.pagination;
        data.result.endpoint = self;
        data.result.next = function() {
            return this.endpoint.get(merge(params, {_skip: this.pagination.skip+this.pagination.limit, _limit: this.pagination.limit}));
        };
        data.result.previous = function() {
            return this.endpoint.get(merge(params, {_skip: this.pagination.skip-this.pagination.limit, _limit: this.pagination.limit}));
        };
        data.result.page = function(page) {
            return this.endpoint.get(merge(params, {_skip: page*this.pagination.limit-this.pagination.limit, _limit: this.pagination.limit}));
        };
        defer.resolve(data.result);
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};

/**
 * Call an endpoint with the HEAD method
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters
 * @return {Promise<object|Error>}
 * @memberof Endpoint
 */
Endpoint.prototype.head = function(params) {
    var self = this;

    self.log.debug("apiFactory (" + self.endpointConfig.name + "): (HEAD) Endpoint called");

    var defer = this.q.defer();

    // Call the given endpoint and get the promise
    this.resource.head(params, function(data, headersFunc) {
        var headers = headersFunc();

        // Check if a prefix is given
        if (angular.isDefined(self.endpointConfig.headResponseHeaderPrefix) && self.endpointConfig.headResponseHeaderPrefix !== '*') {

            for (var header in headers) {
                // Delete all headers without the given prefix
                if (header.toLowerCase().indexOf(self.endpointConfig.headResponseHeaderPrefix.toLowerCase()) !== 0) {
                    delete headers[header];
                    continue;
                }

                // Make a alias without the prefix
                headers[header.substr(self.endpointConfig.headResponseHeaderPrefix.length, header.length)] = headers[header];

                // Delete the orignial headers
                //delete headers[header];
            }
        }

        // Resolve the promise
        defer.resolve(headers);
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};

/**
 * Update an object
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters
 * @param {Model/array} model The model to be updated
 * @return {Promise<Model|Error>}
 * @memberof Endpoint
 */
Endpoint.prototype.put = function (params, model) {


    if (angular.isArray(model)) {
        var tempModels = angular.copy(model);
        model = [];
        angular.forEach(tempModels, function(tempModel) {
            // Set the action that is performed. This can be checked in the model.
            tempModel.__method = 'update';
            tempModel._clean();
            model.push(tempModel);
        });
    } else {
        // Set the action that is performed. This can be checked in the model.
        model.__method = 'update';
        // Call the _clean method of the model
        model._clean();
    }

    this.log.debug("apiFactory (" + this.endpointConfig.name + "): Model to update is:", model);

    var defer = this.q.defer();

    // Use angularjs $resource to perform the update
    this.resource.update(params, model, function (data) {
        defer.resolve(data.result);
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};

/**
 * Save an object
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters
 * @param {Model} model The model to be updated
 * @return {Promise<Model|Error>}
 * @memberof Endpoint
 */
Endpoint.prototype.post = function () {
    var model, params;

    // Check if only two arguments are given
    if (angular.isUndefined(arguments[1])) {
        model = arguments[0];
    } else {
        params = arguments[0];
        model = arguments[1];
    }

    var defer = this.q.defer();

    // Set the action that is performed. This can be checked in the model.
    model.__method = 'save';

    // Call the _clean method of the model
    model._clean();

    this.log.debug("apiFactory (" + this.endpointConfig.name + "): Model to save is:", model);

    // Use angularjs $resource to perform the save
    this.resource.save(params, model, function (data) {
        defer.resolve(data.result);
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};

/**
 * Remove an object
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters
 * @param {Model} model The model to be updated
 * @return {Promise<Model|Error>}
 * @memberof Endpoint
 */
Endpoint.prototype.delete = function() {
    var model, params;

    // Check if only two arguments are given
    if (angular.isUndefined(arguments[1])) {
        model = arguments[0];
    } else {
        params = arguments[0];
        model = arguments[1];
    }

    var defer = this.q.defer();

    // Set the action that is performed. This can be checked in the model.
    model.__method = 'remove';

    // Get the id of the model
    var paramId = {
        id: model[model.__reference]
    };



    this.log.debug("apiFactory (" + this.endpointConfig.name + "): Model to remove is:", model);

    // Use angularjs $resource to perform the delete
    this.resource.delete(merge(paramId, params), function () {
        defer.resolve();
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};