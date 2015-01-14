(function() {
    angular
        .module('restclient', [])
        .provider('api', RestClientProvider)
        .factory('Model', ModelFactory)
        .factory('Validator', ValidatorFactory);

    /**
     * The provider to get the api
     * @constructor
     */
    function RestClientProvider() {
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

        this.pagination = false;

        /**
         * This class represents one configuration for an endpoint
         *
         * @constructor EndpointConfig
         */
        function EndpointConfig() {}

        /**
         * Set the route to this endpoint
         *
         * @param {string} route The endpoint route defined as string
         * @return {EndpointConfig} Returns the endpoint config object
         * @memberof EndpointConfig
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
         * @memberof EndpointConfig
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
         * @memberof EndpointConfig
         */
        EndpointConfig.prototype.container = function(container) {
            this.container = container;
            return this;
        };

        /**
         * Class representing an Endpoint with all the functionality for receiving, saving and updating data from the backend
         *
         * @param {string} endpoint The name of the endpoint
         * @param {EndpointConfig} endpointConfig Config of the endpoint which was defined earlier
         * @param {string} baseRoute URL to the backend
         * @param {$resource} $resource The Angular $resource factory
         * @param {$log} $log The Angular $log factory
         * @param {$injector} $injector The Angular $injector factory
         * @param {$q} $q The Angular $q factory
         * @constructor Endpoint
         * @ngInject
         */
        function Endpoint(endpoint, endpointConfig, pagination, baseRoute, headResponseHeaderPrefix, $resource, $log, $injector, $q) {
            /**
             * The name of the endpoint
             * @type {string}
             */
            this.endpointName = endpoint;

            /**
             * Prefix of a header in a HEAD response
             * @type {string}
             */
            this.headResponseHeaderPrefix = headResponseHeaderPrefix;

            /**
             * The EndpointConfig object defined for this endpoint
             * @type {EndpointConfig}
             */
            this.endpointConfig = endpointConfig;

            this.pagination = pagination;

            /**
             * An instance if the $resource factory from the angularjs library
             * @type {$resource}
             */
            this.resource = $resource(baseRoute + this.endpointConfig.route, {}, {update: {method: 'PUT'}, head: {method: 'HEAD'}});

            /**
             * An instance if the $log factory from the angularjs library
             * @type {$log}
             */
            this.log = $log;

            /**
             * An instance if the $injector factory from the angularjs library
             * @type {$injector}
             */
            this.injector = $injector;

            /**
             * An instance if the $q factory from the angularjs library
             * @type {$q}
             */
            this.q = $q;
        }
        Endpoint.$inject = ["endpoint", "endpointConfig", "pagination", "baseRoute", "headResponseHeaderPrefix", "$resource", "$log", "$injector", "$q"];

        /**
         * Call an endpoint and map the response to one or more models given in the endpoint config
         *
         * @param {object} params The parameters that ether map in the route or get appended as GET parameters
         * @return {Model} Returns one or an array of mapped models
         * @memberof Endpoint
         */
        Endpoint.prototype.get = function (params) {
            var self = this;

            self.log.debug("apiFactory (" + self.endpointName + "): Endpoint called");

            // Set the name of the wrapping container
            var container = self.endpointConfig.container;
            // Get the model object that is used to map the result
            var model = this.injector.get(self.endpointConfig.model);

            self.log.debug("apiFactory (" + self.endpointName + "): Container set to " + container);

            // Call the given endpoint and get the promise
            var resource = this.resource.get(params).$promise;
            return resource.then(function(data) {

                // Check if response is an array
                if (angular.isArray(data[container])) {
                    self.log.debug("apiFactory (" + self.endpointName + "): Result is an array");

                    var models = [];

                    // Iterate thru every object in the response and map it to a model
                    angular.forEach(data[container], function (value) {
                        models.push(new model(value));
                    });

                    if (self.pagination) {
                        var result = {
                            count: data.count,
                            offset: data.offset,
                            limit: data.limit,
                            data: models
                        };
                    } else {
                        var result = models;
                    }

                } else {
                    self.log.debug("apiFactory (" + self.endpointName + "): Result is NOT an array");

                    // If only one object is given, mapp it to the model
                    var result = new model(data);
                }

                self.log.debug("apiFactory (" + self.endpointName + "): Mapped result is");
                self.log.debug(result);

                return result;
            });
        };

        /**
         * Call an endpoint with the HEAD method
         *
         * @param {object} params The parameters that ether map in the route or get appended as GET parameters
         * @return {object} Returns an object with the requested headers
         * @memberof Endpoint
         */
        Endpoint.prototype.head = function(params) {
            var self = this;

            self.log.debug("apiFactory (" + self.endpointName + "): (HEAD) Endpoint called");

            var defer = this.q.defer();

            // Call the given endpoint and get the promise
            this.resource.head(params, function(data, headersFunc) {
                var headers = headersFunc();

                // Check if a prefix is given
                if (angular.isDefined(self.headResponseHeaderPrefix) && self.headResponseHeaderPrefix !== '*') {

                    for (var header in headers) {

                        // Delete all headers without the given prefix
                        if (header.toLowerCase().indexOf(self.headResponseHeaderPrefix.toLowerCase()) != 0) {
                            delete headers[header];
                            continue;
                        }

                        // Make a alias without the prefix
                        headers[header.substr(self.headResponseHeaderPrefix.length, header.length)] = headers[header];

                        // Delete the orignial headers
                        //delete headers[header];
                    }
                }

                // Resolve the promise
                defer.resolve(headers);
            });

            return defer.promise;
        };

        /**
         * Update an object
         *
         * @param {object} params The parameters that ether map in the route or get appended as GET parameters
         * @param {Model} model The model to be updated
         * @param {function} success Callback if the update was an success
         * @param {function} error Callback if the update did not work
         * @memberof Endpoint
         */
        Endpoint.prototype.update = function (params, model, success, error) {
            // Set the action that is performed. This can be checked in the model.
            model.__method = 'update';

            // Call the _clean method of the model
            model._clean();

            this.log.debug("apiFactory (" + this.endpointName + "): Model to update is");
            this.log.debug(model);

            // Use angularjs $resource to perform the update
            this.resource.update(params, model, function () {
                success();
            }, function (givenError) {
                error(givenError);
            });
        };

        /**
         * Save an object
         *
         * @param {object} params The parameters that ether map in the route or get appended as GET parameters
         * @param {Model} model The model to be updated
         * @param {function} success Callback if the update was an success
         * @param {function} error Callback if the update did not work
         * @memberof Endpoint
         */
        Endpoint.prototype.save = function () {
            var params = arguments[0];
            var model = arguments[1];
            var success = arguments[2];
            var error = arguments[3];

            // Check if only three arguments are given
            if (angular.isUndefined(arguments[3])) {
                model = arguments[0];
                success = arguments[1];
                error = arguments[2];
            }

            // Set the action that is performed. This can be checked in the model.
            model.__method = 'save';

            // Call the _clean method of the model
            model._clean();

            this.log.debug("apiFactory (" + this.endpointName + "): Model to save is");
            this.log.debug(model);

            // Use angularjs $resource to perform the save
            this.resource.save(params, model, function () {
                success();
            }, function (givenError) {
                error(givenError);
            });
        };

        /**
         * Set the base route
         * @param {string} baseRoute
         */
        this.baseRoute = function(baseRoute) {
            this.baseRoute = baseRoute;
        };

        /**
         * Set the base route
         * @param {string} baseRoute
         */
        this.enablePagination = function(pagination) {
            this.pagination = pagination;
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
         * @param {Endpoint} endpoint
         */
        this.endpoint = function (endpoint) {
            var endpointConfig = new EndpointConfig();
            this.endpoints[endpoint] = endpointConfig;
            return endpointConfig;
        };

        /**
         * The factory method
         * @param {$injector} $injector
         * @ngInject
         */
        this.$get = ["$injector", function ($injector) {
            var self = this;
            var api = {};

            // Go thru every given endpoint
            angular.forEach(self.endpoints, function (endpointConfig, name) {

                // Check if an container is given and if not, set it to the name of the endpoint
                if (angular.isFunction(endpointConfig.container)) endpointConfig.container = name;

                // Check if headResponseHeaderPrefix is set
                if (angular.isFunction(self.headResponseHeaderPrefix)) delete self.headResponseHeaderPrefix;

                // Get an instance of the endpoint and add it to the api object
                api[name] = $injector.instantiate(Endpoint, {
                    endpoint: name,
                    endpointConfig: endpointConfig,
                    pagination: self.pagination,
                    baseRoute: self.baseRoute,
                    headResponseHeaderPrefix: self.headResponseHeaderPrefix
                });
            });

            return api;
        }];
        this.$get.$inject = ["$injector"];
    }

    /**
     * The factory to get the abstract model
     * @constructor
     * @ngInject
     */
    function ModelFactory($log, $injector, Validator) {

        /**
         * Abstract model class
         *
         * @constructor Model
         */
        function Model() {

            /**
             * The __foreignData variable holds the original object as it was injected.
             * This gets deleted after the model is fully initialized.
             * @type {object}
             */
            this.__foreignData = {};

            /**
             * Holds the annotation of every property of a model.
             * This object gets deleted when the model is sent to the backend.
             * @type {object}
             */
            this.__annotation = {};
        }

        /**
         * This method gets called after the response was transformed into te model.
         * It's helpful when you want to remap attributes or make some changed.
         * To use it, just override it in the concrete model.
         *
         * @memberof Model
         */
        Model.prototype.afterLoad = function() {
            return true;
        };

        /**
         * This method gets called before a model gets sent to the backend.
         * It's helpful when you want to remap attributes or make some changed.
         * To use it, just override it in the concrete model.
         *
         * @memberof Model
         */
        Model.prototype.beforeSave = function() {
            return true;
        };

        /**
         * Every model must call this method in it's constructor. It in charge of mapping the given object to the model.
         *
         * @param {object} object The given object. This can come ether from the backend or created manualy
         * @memberof Model
         */
        Model.prototype.init = function(object) {
            this.__foreignData = object;
            this.__annotation = {};

            $log.debug("Model (" + this.constructor.name + "): Original response object is");
            $log.debug(this.__foreignData);

            for (var property in this) {
                // If property is a method, then continue
                if (!this.hasOwnProperty(property) || ['__foreignData', '__annotation'].indexOf(property) > -1) continue;

                // If annotations are given, set them
                if (angular.isObject(this[property]) && angular.isDefined(this[property].type)) this.__annotation[property] = this[property];

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
                if (angular.isDefined(this.__annotation[property]) && this.__annotation[property].type == 'relation') {
                    var relation = this.__annotation[property].relation;

                    // Check if a foreign field is set and if not, set it to the name of the property
                    if (angular.isUndefined(relation.foreignField)) relation.foreignField = property;

                    // If the foreign field can not be found, continue
                    if (angular.isUndefined(this.__foreignData[relation.foreignField])) continue;

                    // If the foreign field is null, set the property to null
                    if (this.__foreignData[relation.foreignField] === null) {
                        this[property] = null;
                        continue;
                    }

                    // Check which relation typ is defined and map the data
                    if (relation.type == 'many') this._mapArray(property, this.__foreignData[relation.foreignField], relation.model);
                    if (relation.type == 'one') this._mapProperty(property, this.__foreignData[relation.foreignField], relation.model);
                }
            }

            this.afterLoad();
            delete this.__foreignData;
        };

        /**
         * This method can be used to call the beforeSave method on a related model.
         *
         * @param {Model/array} models Can ether be a model or an array of models
         * @memberof Model
         * @deprecated The beforeSave method is called automatically when a save call is performed
         */
        Model.prototype.callBeforeSave = function(models) {

            // Check if models is an array
            if (angular.isArray(models)) {

                // Go thru every model
                angular.forEach(models, function(model) {

                    // Call the _clean method on the related model
                    model._clean();
                });
            }

            // Check if models is an array
            if (angular.isObject(models) && !angular.isArray(models)) {

                // Call the _clean method on the related model
                models._clean();
            }
        };

        /**
         * The __reference is used to get the identifier of a model
         * @type {string}
         */
        Model.prototype.__reference = 'id';

        /**
         * This method gets called bei the api before a model is sent to the backend.
         *
         * @private
         * @memberof Model
         */
        Model.prototype._clean = function() {
            // Call the beforeSave method on the model
            this.beforeSave();

            // Go thru every property of the model
            for (var property in this) {

                // Ckeck if property is a method
                if (!this.hasOwnProperty(property)) continue;


                if (angular.isDefined(this.__annotation[property]) && angular.isDefined(this.__annotation[property].save)) {

                    // Check if property should be deleted before model is saved
                    if (!this.__annotation[property].save) {
                        delete this[property];
                        continue;
                    }

                    // Check if property should only be a reference to another model
                    if (this.__annotation[property].save == 'reference') {
                        this._referenceOnly(this[property]);
                        continue;
                    }
                }

                if (angular.isDefined(this.__annotation[property]) && angular.isDefined(this.__annotation[property].type)) {
                    // If property is a relation then call the _clean method of related models
                    if (this.__annotation[property].type == 'relation' && this[property] !== null) {

                        if (!angular.isDefined(this.__annotation[property].relation.type)) continue;

                        if (this.__annotation[property].relation.type == 'one') {

                            // Call the _clean method on the related model
                            this[property]._clean();
                            continue;
                        }

                        if (this.__annotation[property].relation.type == 'many') {
                            angular.forEach(this[property], function(model) {

                                // Call the _clean method on the related model
                                model._clean();
                            });
                        }
                    }
                }
            }

            // Delete this two properties before model gets saved
            delete this.__method;
            delete this.__annotation;
        };

        /**
         * Maps an array of models to an property
         *
         * @private
         * @param {string} property The property which should be mapped
         * @param {string} apiProperty Foreign property as it comes from the api
         * @param {string} modelName Name of the model which is used for the matching
         * @memberof Model
         */
        Model.prototype._mapArray = function(property, apiProperty, modelName) {
            var self = this;

            // Check if the api property is set
            if (angular.isUndefined(apiProperty) || apiProperty == null || apiProperty.length == 0) {
                self[property] = [];
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
         * Maps an array of models to an property
         *
         * @private
         * @param {string} property The property which should be mapped
         * @param {string} apiProperty Foreign property as it comes from the api
         * @param {string} modelName Name of the model which is used for the matching
         * @memberof Model
         */
        Model.prototype._mapProperty = function(property, apiProperty, modelName) {

            // Check if the api property is set
            if (angular.isUndefined(apiProperty)) {
                this[property] = null;
                return;
            }

            // Load the model
            var model = $injector.get(modelName);

            // Map the model
            this[property] = new model(apiProperty);
        };

        /**
         * Returns only the reference of a related model
         *
         * @private
         * @param {Model/array} models
         * @memberof Model
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
                        if (property != models.__reference) {
                            delete models[property];
                        }
                    }
                }
            }
        };

        /**
         * Validate the properties of the model
         *
         * @memberof Model
         */
        Model.prototype.isValid = function() {
            for (var property in this) {
                // If property is a method, then continue
                if (!this.hasOwnProperty(property)) continue;

                if (angular.isDefined(this.__annotation[property])) {
                    if (!Validator[this.__annotation[property].type](this[property])) return false;
                }
            }

            return true;
        };

        return Model;
    }
    ModelFactory.$inject = ["$log", "$injector", "Validator"];

    function ValidatorFactory() {
        return {
            string: function(string) {
                return angular.isString(string);
            },
            int: function(int) {
                return angular.isNumber(int);
            },
            email: function(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            relation: function(relation) {
                return true;
            },
            boolean: function(boolean) {
                return true;
            },
            date: function(date) {
                return angular.isDate(date);
            },
            float: function(float) {
                return angular.isNumber(float);
            }
        }
    }
})();