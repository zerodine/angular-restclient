;(function() {
"use strict";

angular.module('restclient', ['ngResource']);
/**
 * This is just a helper function because merge is not supported by angular until version > 1.4.
 *
 * @deprecated Will be supported by angular with version > 1.4
 * @param {object} dst
 * @param {object} src
 * @returns {object}
 */
function merge(dst, src) {
    if (!angular.isDefined(dst) && !angular.isDefined(src)) return {};
    if (!angular.isDefined(dst)) return src;
    if (!angular.isDefined(src)) return dst;

    // Use angular merge if angular version >= 1.4
    if (angular.isDefined(angular.merge)) return angular.merge(dst, src);

    var h = dst.$$hashKey;

    if (!angular.isObject(src) && !angular.isFunction(src)) return;
    var keys = Object.keys(src);
    for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src_new = src[key];

        if (angular.isObject(src_new)) {
            if (!angular.isObject(dst[key])) dst[key] = angular.isArray(src_new) ? [] : {};
            this(dst[key], src_new);
        } else {
            dst[key] = src_new;
        }
    }

    if (h) {
        dst.$$hashKey = h;
    } else {
        delete dst.$$hashKey;
    }

    return dst;
}
/**
 * Used to make sure that all HTTP/1.1 methods are implemented
 *
 * @interface
 * @class
 */
function EndpointInterface() {}

/**
 * HTTP/1.1 GET method
 */
EndpointInterface.prototype.get = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 POST method
 */
EndpointInterface.prototype.post = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 DELETE method
 */
EndpointInterface.prototype.delete = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 PUT method
 */
EndpointInterface.prototype.put = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 HEAD method
 */
EndpointInterface.prototype.head = function() { throw new Error('Not Implemented'); };
angular.extend(EndpointAbstract.prototype, EndpointInterface.prototype);

/**
 * Abstract Endpoint class with all helper methods
 *
 * @class
 * @implements {EndpointInterface}
 */
function EndpointAbstract() {}

/**
 * Maps an object or array to the endpoint model
 *
 * @protected
 * @param {object} data Object or array of raw data
 * @return {Model|Array}
 * @abstract
 */
EndpointAbstract.prototype._mapResult = function(data) {
    var self = this;
    var result;
    self._log.debug("apiFactory (" + self._endpointConfig.name + "): Endpoint called");

    // Set the name of the wrapping container
    var container = self._endpointConfig.container;
    // Get the model object that is used to map the result
    var model = this._injector.get(self._endpointConfig.model);

    self._log.debug("apiFactory (" + self._endpointConfig.name + "): Container set to " + container);

    // Check if response is an array
    if (angular.isArray(data) || angular.isArray(data[container])) {
        self._log.debug("apiFactory (" + self._endpointConfig.name + "): Result is an array");

        var arrayData = angular.isArray(data) ? data : data[container];
        var models = [];

        // Iterate thru every object in the response and map it to a model
        angular.forEach(arrayData, function (value) {
            models.push(new model(value));
        });

        result = models;

    } else {
        self._log.debug("apiFactory (" + self._endpointConfig.name + "): Result is NOT an array");

        // If only one object is given, map it to the model
        result = new model(data);
    }

    self._log.debug("apiFactory (" + self._endpointConfig.name + "): Mapped result is:", result);

    return result;
};

/**
 * Extract the pagination data from the result
 *
 * @protected
 * @param {object} data Object or array of raw data
 * @return {object}
 * @abstract
 */
EndpointAbstract.prototype._getPagination = function(data) {
    if (
        angular.isDefined(data.count) &&
        angular.isDefined(data.limit) &&
        angular.isDefined(data.skip) &&
        data.limit > 0
    ) {
        // Calc the number of pages and generate array
        data.pagesArray = [];

        var pages = data.count / data.limit;
        if (pages % 1 !== 0) pages = Math.ceil(pages);

        var currentPage = parseInt(data.skip / data.limit + 1);
        var currentPageItemsCount = data.limit;
        if (data.skip+1+data.limit > data.count) {
            if (currentPage == 1) {
                currentPageItemsCount = data.limit;
            } else {
                currentPageItemsCount = data.count - ((currentPage-1)*data.limit);
            }
        }

        var i;
        if (pages < 11) {
            for (i=1; i<=pages; i++) data.pagesArray.push(i);
        } else if (currentPage <= 5) {
            for (i=1; i<=11; i++) data.pagesArray.push(i);
        } else if (currentPage >= pages-5) {
            for (i=pages-11; i<=pages; i++) data.pagesArray.push(i);
        } else {
            for (i=currentPage-5; i<=currentPage+5; i++) data.pagesArray.push(i);
        }


        return {
            count: data.count,
            limit: data.limit,
            skip: data.skip,
            pagesArray: data.pagesArray,
            pagesCount: pages,
            currentPage: currentPage,
            currentPageItemsCount: currentPageItemsCount
        };
    }

    return null;
};

/**
 * @abstract
 */
EndpointAbstract.prototype.update = function() {
    return this.put.apply(this, arguments);
};

/**
 * @abstract
 */
EndpointAbstract.prototype.save = function() {
    return this.post.apply(this, arguments);
};

/**
 * @abstract
 */
EndpointAbstract.prototype.remove = function() {
    return this.delete.apply(this, arguments);
};
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

    var defer = this._q.defer();

    if (angular.isArray(model)) {
        var tempModels = angular.copy(model);
        model = [];
        angular.forEach(tempModels, function(tempModel) {
            tempModel.clean();
            model.push(tempModel);
        });
    } else {
        // Call the clean method of the model
        model.clean();
    }

    this._log.debug("apiFactory (" + this._endpointConfig.name + "): Model to update is:", model);

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
    while (param !== null) {
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

    var mock = new this.mock();
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
    var mock = new this.mock();
    var defer = this._q.defer();

    // Check if only two arguments are given
    if (angular.isUndefined(arguments[1])) {
        model = arguments[0];
    } else {
        params = arguments[0];
        model = arguments[1];
    }

    // Set the action that is performed. This can be checked in the model.
    model._method = 'save';

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
    var mock = new this.mock();
    var defer = this._q.defer();

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

    var data = mock.request('PUT', this._extractParams(params), model);
    var mappedResult = this._mapResult(data);
    defer.resolve(mappedResult);

    return defer.promise;
};
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
angular
    .module('restclient')
    .factory('Model', ModelFactory);

/**
 * @ngInject
 * @class
 */
function ModelFactory($log, $injector, Validator) {

    /**
     * Abstract model class
     *
     * @class
     * @example
     * angular.module('UserModel', [])
     *  .factory('UserModel', function(Model) {
     *
     *      angular.extend(UserModel.prototype, Model.prototype);
     *
     *       function UserModel(object) {
     *
     *           this.id = {
     *               type: 'string',
     *               save: false
     *           };
     *
     *           this.firstname = {
     *               type: 'string'
     *           };
     *
     *           this.lastname = {
     *               type: 'string'
     *           };
     *
     *           this.fullname = {
     *               type: 'string',
     *               save: false
     *           };
     *
     *           // Map the given object
     *           this._init(object);
     *       }
     *
     *       UserModel.prototype._afterLoad = function(foreignData) {
     *           this.fullname = foreignData['firstname'] + ' ' + foreignData['lastname'];
     *       };
     *
     *       UserModel.prototype._beforeSave = function() {
     *           this.firstname = this.firstname + '_';
     *       };
     *
     *       return UserModel;
     *  })
     */
    function Model() {
        /**
         * Holds the annotation of every property of a model.
         * This object gets deleted when the model is sent to the backend.
         *
         * @type {object}
         * @private
         */
        this._annotation = {};
    }

    /**
     * The reference is used to get the identifier of a model
     * @type {string}
     * @example
     * ConcreteModel.prototype.reference = 'identifier';
     */
    Model.prototype.reference = 'id';

    /**
     * Constant to define the performed method on a model
     *
     * @type {string}
     * @constant
     */
    Model.prototype.METHOD_SAVE = 'save';

    /**
     * Constant to define the performed method on a model
     *
     * @type {string}
     * @constant
     */
    Model.prototype.METHOD_UPDATE = 'update';

    /**
     * This method gets called by the endpoint before the model is sent to the backend.
     * It removes all decorator methods and attributes from a model so its clean to be sent.
     *
     * @param {string} method Provides the method that is performed on this model
     * @param {boolean} parent Defines if the clean was called by a parent model
     */
    Model.prototype.clean = function(method, parent) {
        var self = this;

        if (!angular.isDefined(method)) {
            method = self.METHOD_SAVE;
            if (self[self.reference] !== null) method = self.METHOD_UPDATE;
        }

        if (!angular.isDefined(parent)) parent = false;

        // Call the beforeSave method on the model
        self._beforeSave(method, parent);

        // Go thru every property of the model
        for (var property in self) {
            // Ckeck if property is a method
            if (!self.hasOwnProperty(property)) continue;

            // Check if property is null
            if (self[property] === null) {
                delete self[property];
                continue;
            }

            if (angular.isDefined(self._annotation[property]) && angular.isDefined(self._annotation[property].save)) {

                // Check if property should be deleted before model is saved
                if (!self._annotation[property].save) {
                    delete self[property];
                    continue;
                }

                // Check if property should only be a reference to another model
                if (self._annotation[property].save == 'reference') {
                    self._referenceOnly(self[property]);
                    continue;
                }
            }

            if (angular.isDefined(self._annotation[property]) && angular.isDefined(self._annotation[property].type)) {
                // If property is a relation then call the clean method of related models
                if (self._annotation[property].type == 'relation' && self[property] !== null) {

                    if (!angular.isDefined(self._annotation[property].relation.type)) continue;

                    if (self._annotation[property].relation.type == 'one') {

                        // Call the clean method on the related model
                        self[property].clean(method, true);
                        continue;
                    }

                    if (self._annotation[property].relation.type == 'many') {
                        angular.forEach(self[property], function(model) {

                            // Call the clean method on the related model
                            model.clean(method, true);
                        });

                        // not needed
                        // continue;
                    }
                }
            }
        }

        // Delete self two properties before model gets saved
        delete self._annotation;
    };

    /**
     * This method gets called after the response was transformed into te model.
     * It's helpful when you want to remap attributes or make some changed.
     * To use it, just override it in the concrete model.
     *
     * @param {object} foreignData Provides the foreign data in order to perform custom mapping after the model was loaded
     * @protected
     * @example
     * ConcreteModel.prototype._afterLoad = function(foreignData) {
     *      this.activation_token = this.activation_token.toUpperCase();
     * };
     */
    Model.prototype._afterLoad = function(foreignData) {};

    /**
     * This method gets called before a model gets sent to the backend.
     * It's helpful when you want to remap attributes or make some changed.
     * To use it, just override it in the concrete model.
     *
     * @param {string} method Provides the method that is performed on this model
     * @param {boolean} parent Defines if the clean was called by a parent model
     * @protected
     * @example
     * ConcreteModel.prototype._beforeSave = function(method, parent) {
     *      this.activation_token = this.activation_token.toLowerCase();
     * };
     */
    Model.prototype._beforeSave = function(method, parent) {};

    /**
     * Every model must call this method in it's constructor. It in charge of mapping the given object to the model.
     *
     * @param {object} object The given object. This can come ether from the backend or created manually.
     * @protected
     */
    Model.prototype._init = function(object) {
        var foreignData = object;
        this._annotation = {};

        $log.debug("Model (" + this.constructor.name + "): Original response object is:", foreignData);

        for (var property in this) {
            // If property is a method, then continue
            if (!this.hasOwnProperty(property)) continue;
            if (['_afterLoad', '_annotation'].indexOf(property) > -1) continue;

            // If annotations are given, set them
            if (angular.isObject(this[property]) && angular.isDefined(this[property].type)) this._annotation[property] = this[property];

            // If no object is given, stop here
            if (angular.isUndefined(object)) continue;

            // If the given object does not have an property set, it's going to be null
            if(!angular.isObject(object) || !object.hasOwnProperty(property)) {
                this[property] = null;
                continue;
            }

            // Assign the properties
            this[property] = object[property];

            // Check if the property is a relation
            if (angular.isDefined(this._annotation[property]) && this._annotation[property].type == 'relation') {
                var relation = this._annotation[property].relation;

                // Check if a foreign field is set and if not, set it to the name of the property
                if (angular.isUndefined(relation.foreignField)) relation.foreignField = property;

                // If the foreign field can not be found, continue
                if (angular.isUndefined(foreignData[relation.foreignField])) continue;

                // If the foreign field is null, set the property to null
                if (foreignData[relation.foreignField] === null) {
                    this[property] = null;
                    continue;
                }

                // Check which relation typ is defined and map the data
                if (relation.type == 'many') this._mapArray(property, foreignData[relation.foreignField], relation.model);
                if (relation.type == 'one') this._mapProperty(property, foreignData[relation.foreignField], relation.model);
            }
        }

        this._afterLoad(foreignData);
    };

    /**
     * Maps an array of models to a property.
     *
     * @protected
     * @param {string} property The property which should be mapped
     * @param {array} apiProperty Foreign property as it comes from the backend
     * @param {string} modelName Name of the model which is used for the mapping
     */
    Model.prototype._mapArray = function(property, apiProperty, modelName) {
        var self = this;

        // Check if the api property is set
        if (angular.isUndefined(apiProperty) || apiProperty === null || apiProperty.length === 0) {
            self[property] = [];
            return;
        }

        // If no model is set return the raw value
        if (modelName === null) {
            angular.forEach(apiProperty, function(value) {
                self[property].push(value);
            });
            return;
        }

        // Load the model
        var model = $injector.get(modelName);

        self[property] = [];

        // Map the model
        angular.forEach(apiProperty, function(value) {
            self[property].push(new model(value));
        });
    };

    /**
     * Maps a model to an property.
     *
     * @protected
     * @param {string} property The property which should be mapped
     * @param {string} apiProperty Foreign property as it comes from the api
     * @param {string} modelName Name of the model which is used for the matching
     */
    Model.prototype._mapProperty = function(property, apiProperty, modelName) {

        // Check if the api property is set
        if (angular.isUndefined(apiProperty)) {
            this[property] = null;
            return;
        }


        // If no model is set return the raw value
        if (modelName === null) {
            this[property] = apiProperty;
            return;
        }

        // Load the model
        var model = $injector.get(modelName);

        // Map the model
        this[property] = new model(apiProperty);
    };

    /**
     * Returns only the reference of a related model.
     *
     * @protected
     * @param {Model/array<Model>} models
     */
    Model.prototype._referenceOnly = function(models) {

        // Check if models is an array
        if (angular.isArray(models)) {

            // Go thru all models in the array an call the __referenceOnly method
            angular.forEach(models, function(model) {
                model._referenceOnly(model);
            });
        } else {

            // Go thru all properties an delete all that are not the identifier
            for (var property in models) {
                if(models.hasOwnProperty(property)) {
                    if (property != models.reference) {
                        delete models[property];
                    }
                }
            }
        }
    };

    /**
     * Validates the model and provides the result as an callback
     *
     * @param {function} result Callback that provides the boolean "valid" and object "errors"
     */
    Model.prototype.validate = function(result) {
        var validator = new Validator();
        var valid = true;
        var errors = {};

        for (var property in this) {

            // If property is a method, then continue
            if (!this.hasOwnProperty(property)) continue;

            // First check if model is annotated
            if (angular.isDefined(this._annotation[property])) {

                // Required
                if (
                    angular.isDefined(this._annotation[property].required) &&
                    (
                        this._annotation[property].required && this[property] === null ||
                        this._annotation[property].required && this[property] === ''
                    )
                ) {
                    valid = false;
                    errors[property] = 'required';
                }

                // Not Required and Not Null
                else if (!angular.isDefined(this._annotation[property].required) && this[property] === null) {}

                // Relation One
                else if (this._annotation[property].type == 'relation' && this._annotation[property].relation.type == 'one') {

                    this[property].validate(function(model_valid, model_errors) {
                        if (!model_valid) {
                            valid = false;
                            errors[property] = model_errors;
                        }
                    });
                }

                // Relation Many
                else if (this._annotation[property].type == 'relation' && this._annotation[property].relation.type == 'many') {
                    angular.forEach(this[property], function(model, key) {

                        model.validate(function(model_valid, model_errors) {
                            if (!model_valid) {
                                valid = false;
                                if (!angular.isArray(errors[property])) errors[property] = [];
                                errors[property][key] = model_errors;
                            }
                        });
                    });
                }

                // Format
                else {
                   if(!validator[this._annotation[property].type](this[property])) {
                       valid = false;
                       errors[property] = 'format_error_' + this._annotation[property].type;
                   }
                }
            }
        }

        if (angular.isFunction(result)) result(valid, errors);
    };

    /**
     * Validates the properties of the model.
     *
     * @return {boolean}
     */
    Model.prototype.isValid = function() {
        var valid = false;
        this.validate(function(model_valid) {
            valid = model_valid;
        });

        return valid;
    };

    return Model;
}
ModelFactory.$inject = ["$log", "$injector", "Validator"];
angular
    .module('restclient')
    .factory('Mock', MockFactory);

/**
 * @ngInject
 * @class
 */
function MockFactory() {

    /**
     * Abstract mock object in order to mock backend data.
     *
     * @class
     * @example
     * angular.module('UsersMock', [])
     *  .factory('UsersMock', function(Mock) {
     *       angular.extend(UsersMock.prototype, Mock.prototype);
     *
     *       function TestUsersMock() {
     *           // Define routes for this mock with a reference to a method
     *           this.routes({
     *               '[GET]/': this.get
     *           })
     *       }
     *
     *       UsersMock.prototype.get = function() {
     *           return {
     *               users: [
     *                   {
     *                       id: 1,
     *                       firstname: 'Jack',
     *                       lastname: 'Bauer'
     *                   },
     *                   {
     *                       id: 2,
     *                       firstname: 'Sandra',
     *                       lastname: 'Bullock'
     *                   }
     *               ]
     *           }
     *       };
     *
     *       return UsersMock;
     *  }
     * )
     */
    function Mock() {
        /**
         * This object represents all the routes of a mock and is used to match a request to a given method
         *
         * @type {object}
         * @private
         */
        this._routeMatcher = {};
    }

    /**
     * Creates a object representing all the defined routes for a specific mock. Implemented in the constructor of the concrete mock.
     *
     * @param {object} routes All route definition for this mock
     * @protected
     * @abstract
     * @example
     * function TestUsersMock() {
     *      this._routes({
     *          '[GET]/': this.get,
     *          '[GET]/:id': this.getUser,
     *          '[POST]/': this.postUser,
     *          '[POST]/:id/:controller': this.postUserCompany,
     *          '[PUT]/:id': this.putUser
     *      })
     * }
     */
    Mock.prototype._routes = function (routes) {
        this._routeMatcher = {};

        for (var route in routes) {
            if (!routes.hasOwnProperty(route)) continue;

            this._routeMatcher[route.match(/\[(GET|POST|PUT|DELETE|PATCH|HEAD)\]/)[1] + (route.match(/:/g) || []).length] = routes[route];
        }
    };

    /**
     * Will be called from the endpoint to actually request the mock.
     *
     * @param {string} method The HTTP method as found in the HTTP/1.1 description
     * @param {object} params All parameters as defined in the route object. Parameters not defined in the route configuration will be requested as query parameters.
     * @param {string} body The HTTP body as described in HTTP/1.1
     * @abstract
     * @returns {*} Defined in the concret mock
     */
    Mock.prototype.request = function (method, params, body) {
        if (!angular.isDefined(params)) params = [];

        if (angular.isDefined(this._routeMatcher[method + params.length])) {
            var methodName = method + params.length;
            if (angular.isDefined(body)) params.push({body: body});

            return this._routeMatcher[methodName].apply(this, params);
        }
    };

    return Mock;
}
angular
    .module('restclient')
    .factory('Validator', ValidatorFactory);

/**
 * @ngInject
 * @class
 */
function ValidatorFactory() {

    /**
     * Helper class to validate a model
     *
     * @class
     */
    function Validator() {
    }

    /**
     * Checks if the given parameter is a string
     *
     * @param string
     * @returns {boolean}
     */
    Validator.prototype.string = function (string) {
        return angular.isString(string);
    };

    /**
     * Checks if the given parameter is a string
     *
     * @param int
     * @returns {boolean}
     */
    Validator.prototype.int = function (int) {
        return angular.isNumber(int);
    };

    /**
     * Checks if the given parameter is a email
     *
     * @param email
     * @returns {boolean}
     */
    Validator.prototype.email = function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    /**
     * Checks if the given parameter is a relation
     *
     * @param relation
     * @returns {boolean}
     */
    Validator.prototype.relation = function (relation) {
        return (angular.isArray(relation) || angular.isObject(relation));
    };

    /**
     * Checks if the given parameter is a boolean
     *
     * @param boolean
     * @returns {boolean}
     */
    Validator.prototype.boolean = function (boolean) {
        if (!angular.isDefined(boolean) ||
            boolean === null ||
            !angular.isDefined(boolean.constructor)) {
            return false;
        }
        return (boolean.constructor === Boolean);
    };

    /**
     * Checks if the given parameter is a date
     *
     * @param date
     * @returns {boolean}
     */
    Validator.prototype.date = function (date) {
        return angular.isDate(date);
    };

    /**
     * Checks if the given parameter is a float
     *
     * @param float
     * @returns {boolean}
     */
    Validator.prototype.float = function (float) {
        return angular.isNumber(float);
    };

    return Validator;
}
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
     * @protected
     */
    this._endpoints = {};

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
     * @return {EndpointConfig}
     */
    this.endpoint = function(endpoint) {
        var endpointConfig = new EndpointConfig(endpoint);
        this._endpoints[endpoint] = endpointConfig;
        return endpointConfig;
    };

    /**
     * The factory method
     *
     * @param {$injector} $injector
     * @ngInject
     */
    this.$get = ["$injector", function($injector) {
        var self = this;
        var api = {};

        // Go thru every given endpoint
        angular.forEach(self._endpoints, function (endpointConfig) {

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
    }];
    this.$get.$inject = ["$injector"];
}
}());
