(function() {
    angular
        .module('restclient', [])
        .provider('api', restclientProvider)
        .factory('Model', Model)
        .factory('Validator', Validator);

    function restclientProvider() {
        this.endpoints = {};
        this.baseRoute = "";

        function EndpointConfig() {
        }

        EndpointConfig.prototype.route = function(route) {
            this.route = route;
            return this;
        };

        EndpointConfig.prototype.model = function(model) {
            this.model = model;
            return this;
        };

        EndpointConfig.prototype.container = function(container) {
            this.container = container;
            return this;
        };

        function Endpoint(endpoint, endpointConfig, baseRoute, $resource, $log, $injector) {
            this.endpointName = endpoint;
            this.endpointConfig = endpointConfig;
            this.resource = $resource(baseRoute + this.endpointConfig.route, {}, {update: {method: 'PUT'}});
            this.log = $log;
            this.injector = $injector;
        }
        Endpoint.$inject = ["endpoint", "endpointConfig", "baseRoute", "$resource", "$log", "$injector"];

        Endpoint.prototype.get = function (params) {
            var self = this;

            self.log.debug("apiFactory (" + self.endpointName + "): Endpoint called");

            var container = self.endpointConfig.container;
            var model = this.injector.get(self.endpointConfig.model);

            self.log.debug("apiFactory (" + self.endpointName + "): Container set to " + container);

            var resource = this.resource.get(params).$promise;
            return resource.then(function (result) {

                if (angular.isArray(result[container])) {
                    self.log.debug("apiFactory (" + self.endpointName + "): Result is an array");

                    var models = [];

                    angular.forEach(result[container], function (value) {
                        models.push(new model(value));
                    });
                } else {
                    self.log.debug("apiFactory (" + self.endpointName + "): Result is NOT an array");

                    var models = new model(result);
                }

                self.log.debug("apiFactory (" + self.endpointName + "): Mapped result is");
                self.log.debug(models);
                return models;
            });
        };

        Endpoint.prototype.update = function (params, model, success, error) {
            model._clean();

            this.log.debug("apiFactory (" + this.endpointName + "): Model to update is");
            this.log.debug(model);

            this.resource.update(params, model, function () {
                success();
            }, function (givenError) {
                error(givenError);
            });
        };

        Endpoint.prototype.save = function () {
            var params = arguments[0];
            var model = arguments[1];
            var success = arguments[2];
            var error = arguments[3];

            if (angular.isUndefined(arguments[3])) {
                model = arguments[0];
                success = arguments[1];
                error = arguments[2];
            }

            model._clean();

            this.log.debug("apiFactory (" + this.endpointName + "): Model to save is");
            this.log.debug(model);

            this.resource.save(params, model, function () {
                success();
            }, function (givenError) {
                error(givenError);
            });
        };

        this.baseRoute = function(baseRoute) {
            this.baseRoute = baseRoute;
        };

        this.endpoint = function (endpoint) {
            var endpointConfig = new EndpointConfig();
            this.endpoints[endpoint] = endpointConfig;
            return endpointConfig;
        };

        this.$get = ['$injector', function ($injector) {
            var self = this;
            var api = {};

            angular.forEach(self.endpoints, function (endpointConfig, name) {

                if (angular.isFunction(endpointConfig.container)) endpointConfig.container = name;

                api[name] = $injector.instantiate(Endpoint, {
                    endpoint: name,
                    endpointConfig: endpointConfig,
                    baseRoute: self.baseRoute
                });
            });

            return api;
        }];
    }

    function Model($log, $injector, Validator) {
        function Model() {}

        Model.prototype.afterLoad = function() {
            return true;
        };

        Model.prototype.beforeSave = function() {
            return true;
        };

        Model.prototype._clean = function() {
            for (var property in this) {
                if (!this.hasOwnProperty(property)) continue;

                if (angular.isDefined(this.__annotation[property]) && angular.isDefined(this.__annotation[property].save)) {
                    if (!this.__annotation[property].save) delete this[property];
                    if (this.__annotation[property].save == 'reference') this.referenceOnly(this[property]);
                }
            }
            delete this.__annotation;

            this.beforeSave();
        };

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

                if(!angular.isObject(object) || !object.hasOwnProperty(property)) {
                    this[property] = null;
                    continue;
                }

                this[property] = object[property];

                if (angular.isDefined(this.__annotation[property]) && this.__annotation[property].type == 'relation') {
                    var relation = this.__annotation[property].relation;

                    if (angular.isUndefined(relation.foreignField)) relation.foreignField = property;
                    if (angular.isUndefined(this.__foreignData[relation.foreignField])) continue;

                    if (relation.type == 'many') this.mapArray(property, this.__foreignData[relation.foreignField], relation.model);
                    if (relation.type == 'one') this.mapProperty(property, this.__foreignData[relation.foreignField], relation.model);
                }
            }

            this.afterLoad();
            delete this.__foreignData;
        };

        Model.prototype.mapArray = function(attribute, apiAttributes, modelName) {
            var self = this;

            if (angular.isUndefined(apiAttributes) || apiAttributes == null || apiAttributes.length == 0) {
                self[attribute] = [];
                return;
            }

            var model = $injector.get(modelName);

            self[attribute] = [];
            angular.forEach(apiAttributes, function(value) {
                self[attribute].push(new model(value));
            });
        };

        Model.prototype.mapProperty = function(attribute, apiAttribute, modelName) {
            if (angular.isUndefined(apiAttribute)) {
                this[attribute] = null;
                return;
            }

            var model = $injector.get(modelName);

            this[attribute] = new model(apiAttribute);
        };

        Model.prototype.__reference = 'id';

        Model.prototype.referenceOnly = function(models) {
            if (angular.isArray(models)) {
                angular.forEach(models, function(model) {
                    model.referenceOnly(model);
                });
            } else {
                for (var property in models) {
                    if(models.hasOwnProperty(property)) {
                        if (property != models.__reference) {
                            delete models[property];
                        }
                    }
                }
            }
        };

        Model.prototype.callBeforeSave = function(models) {
            if (angular.isArray(models)) {
                angular.forEach(models, function(model) {
                    model._clean();
                });
            }

            if (angular.isObject(models) && !angular.isArray(models)) {
                models._clean();
            }
        };

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
    Model.$inject = ["$log", "$injector", "Validator"];

    function Validator() {
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