angular.extend(Endpoint.prototype, EndpointAbstract.prototype);

/**
 * Class representing an Endpoint with all the functionality for receiving, saving and updating data from the backend
 *
 * @param {EndpointConfig} endpointConfig Config of the endpoint which was defined earlier
 * @param {$injector} $injector The Angular $injector factory
 * @class
 */
function Endpoint(endpointConfig, $injector) {
    var self = this;

    /**
     * The EndpointConfig object defined for this endpoint
     * @type {EndpointConfig}
     * @protected
     */
    this._endpointConfig = endpointConfig;

    /**
     * An instance if the $resource factory from the angularjs library
     * @type {$resource}
     * @protected
     */
    this._resource = $injector.get('$resource')(this._endpointConfig.baseRoute + this._endpointConfig.route, {}, merge({
        get: {
            method: 'GET',
            transformResponse: function(data, headers, status) {
                data = angular.fromJson(data);
                if (status >= 400) return data;

                return {
                    result: self._mapResult(angular.fromJson(data)),
                    pagination: self._getPagination(data)
                };
            }
        },
        save: {
            method: 'POST',
            transformResponse: function(data, headers, status) {
                data = angular.fromJson(data);
                if (status >= 400) return data;

                return {result: self._mapResult(data)};
            }
        },
        update: {
            method: 'PUT',
            transformResponse: function(data, headers, status) {
                data = angular.fromJson(data);
                if (status >= 400) return data;

                return {result: self._mapResult(data)};
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
     * @protected
     */
    this._log = $injector.get('$log');

    /**
     * An instance if the $injector factory from the angularjs library
     * @type {$injector}
     * @protected
     */
    this._injector = $injector;

    /**
     * An instance if the $q factory from the angularjs library
     * @type {$q}
     * @protected
     */
    this._q = $injector.get('$q');
}

/**
 * Call an endpoint and map the response to one or more models given in the endpoint config.
 * The server response must be an object.
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters
 * @return {Promise<Model|Error>}
 */
Endpoint.prototype.get = function (params) {
    var self = this;
    var defer = self._q.defer();

    this._resource.get(params, function(data) {
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
 * Call an endpoint with the HEAD method.
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters
 * @return {Promise<object|Error>}
 */
Endpoint.prototype.head = function(params) {
    var self = this;

    self._log.debug("apiFactory (" + self._endpointConfig.name + "): (HEAD) Endpoint called");

    var defer = this._q.defer();

    // Call the given endpoint and get the promise
    this._resource.head(params, function(data, headersFunc) {
        var headers = headersFunc();

        // Check if a prefix is given
        if (angular.isDefined(self._endpointConfig.headResponseHeaderPrefix) && self._endpointConfig.headResponseHeaderPrefix !== '*') {

            for (var header in headers) {
                // Delete all headers without the given prefix
                if (header.toLowerCase().indexOf(self._endpointConfig.headResponseHeaderPrefix.toLowerCase()) !== 0) {
                    delete headers[header];
                    continue;
                }

                // Make a alias without the prefix
                headers[header.substr(self._endpointConfig.headResponseHeaderPrefix.length, header.length)] = headers[header];

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
 * Update an object.
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters.
 * @param {Model/array} model The model to be updated.
 * @return {Promise<Model|Error>}
 */
Endpoint.prototype.put = function (params, model) {


    if (angular.isArray(model)) {
        var tempModels = angular.copy(model);
        model = [];
        angular.forEach(tempModels, function(tempModel) {
            // Set the action that is performed. This can be checked in the model.
            tempModel._method = 'update';
            tempModel.clean();
            model.push(tempModel);
        });
    } else {
        // Set the action that is performed. This can be checked in the model.
        model._method = 'update';
        // Call the clean method of the model
        model.clean();
    }

    this._log.debug("apiFactory (" + this._endpointConfig.name + "): Model to update is:", model);

    var defer = this._q.defer();

    // Use angularjs $resource to perform the update
    this._resource.update(params, model, function (data) {
        defer.resolve(data.result);
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};

/**
 * Save an object.
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters.
 * @param {Model} model The model to be updated.
 * @return {Promise<Model|Error>}
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

    var defer = this._q.defer();

    // Set the action that is performed. This can be checked in the model.
    model._method = 'save';

    // Call the clean method of the model
    model.clean();

    this._log.debug("apiFactory (" + this._endpointConfig.name + "): Model to save is:", model);

    // Use angularjs $resource to perform the save
    this._resource.save(params, model, function (data) {
        defer.resolve(data.result);
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};

/**
 * Remove an object.
 *
 * @param {object} params The parameters that ether map in the route or get appended as GET parameters.
 * @param {Model} model The model to be updated.
 * @return {Promise<Model|Error>}
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

    var defer = this._q.defer();

    // Set the action that is performed. This can be checked in the model.
    model._method = 'remove';

    // Get the id of the model
    var paramId = {
        id: model[model.reference]
    };



    this._log.debug("apiFactory (" + this._endpointConfig.name + "): Model to remove is:", model);

    // Use angularjs $resource to perform the delete
    this._resource.delete(merge(paramId, params), function () {
        defer.resolve();
    }, function (error) {
        defer.reject(error);
    });

    return defer.promise;
};