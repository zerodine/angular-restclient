angular.extend(EndpointMock.prototype, EndpointAbstract.prototype);

/**
 * EndpointMock provides all methods which Endpoint provides but sends the request to mocks
 *
 * @param endpointConfig EndpointConfig of the Endpoint
 * @param $injector The angular $injector provider
 * @class
 */
function EndpointMock(endpointConfig, $injector) {
    this._endpointConfig = endpointConfig;
    this._q = $injector.get('$q');
    this._log = $injector.get('$log');
    this._injector = $injector;

    this.mock = $injector.get(endpointConfig.mock);
}

/**
 * Order all params according the endpoints route
 *
 * @param params Params as unordered object
 * @returns {Array} Ordered according route
 * @protected
 */
EndpointMock.prototype._extractParams = function(params) {
    var paramsOrder = [];
    var regex = /:(\w+)/g;
    var param = regex.exec(this._endpointConfig.route);
    while (param != null) {
        paramsOrder.push(param[1]);
        param = regex.exec(this._endpointConfig.route);
    }

    var orderedParams = [];
    angular.forEach(paramsOrder, function(param) {
        if (angular.isObject(params) && angular.isDefined(params[param])) orderedParams.push(params[param]);
    });

    return orderedParams;
};

/**
 * Receive the mocks content
 *
 * @param params Request parameter
 * @returns {Promise<Model|Error>} Promise with models
 */
EndpointMock.prototype.get = function(params) {
    var defer = this._q.defer();

    var mock = new this.mock;
    var data = mock.request('GET', this._extractParams(params));
    var mappedResult = this._mapResult(data);

    defer.resolve(mappedResult);

    return defer.promise;
};

/**
 * Save an model to a mock endpoint
 *
 * @returns {Promise<Model|Error>} with model
 */
EndpointMock.prototype.post = function() {
    var model, params;
    var mock = new this.mock;
    var defer = this._q.defer();

    // Check if only two arguments are given
    if (angular.isUndefined(arguments[1])) {
        model = arguments[0];
    } else {
        params = arguments[0];
        model = arguments[1];
    }

    // Set the action that is performed. This can be checked in the model.
    model.__method = 'save';

    // Call the clean method of the model
    model.clean();

    var data = mock.request('POST', this._extractParams(params), model);
    var mappedResult = this._mapResult(data);

    defer.resolve(mappedResult);

    return defer.promise;
};


/**
 * Update an existing model
 *
 * @param params Request parameters
 * @param model Model to update
 * @returns {Promise<Model|Error>} Updated model
 */
EndpointMock.prototype.put = function (params, model) {
    var mock = new this.mock;
    var defer = this._q.defer();

    if (angular.isArray(model)) {
        var tempModels = angular.copy(model);
        model = [];
        angular.forEach(tempModels, function(tempModel) {
            // Set the action that is performed. This can be checked in the model.
            tempModel.__method = 'update';
            tempModel.clean();
            model.push(tempModel);
        });
    } else {
        // Set the action that is performed. This can be checked in the model.
        model.__method = 'update';
        // Call the clean method of the model
        model.clean();
    }

    var data = mock.request('PUT', this._extractParams(params), model);
    var mappedResult = this._mapResult(data);
    defer.resolve(mappedResult);

    return defer.promise;
};