(function() {
    angular
        .module('restclient', [])
        .provider('restclient', restclientProvider)
        .factory('Model', Model);

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
            model.beforeSave();

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

            if (typeof arguments[3] === 'undefined') {
                model = arguments[0];
                success = arguments[1];
                error = arguments[2];
            }

            console.log(params);
            console.log(model);

            model.beforeSave();

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

    function Model($log, $injector) {
        function Model() {}

        Model.prototype.afterLoad = function() {
            return true;
        };

        Model.prototype.beforeSave = function() {
            return true;
        };

        Model.prototype.objectMapper = function(object) {
            if (typeof object === 'undefined') return false;

            this.__foreignData = object;

            $log.debug("Model (" + this.constructor.name + "): Original response object is");
            $log.debug(this.__foreignData);

            for (var property in this) {
                if(this.hasOwnProperty(property) && object.hasOwnProperty(property)){
                    this[property] = object[property];
                }
            }

            this.afterLoad();
            delete this.__foreignData;
        };

        Model.prototype.mapArray = function(attribute, apiAttributes, modelName) {
            var self = this;

            if (typeof apiAttributes === 'undefined' || apiAttributes == null || apiAttributes.length == 0) {
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
            if (typeof apiAttribute === 'undefined') {
                this[attribute] = "";
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
                    model.beforeSave();
                });
            } else {
                models.beforeSave();
            }
        };

        Model.prototype.getNewModel = function(model) {
            var Model = $injector.get(model);
            return new Model();
        };

        return Model;
    }
    Model.$inject = ["$log", "$injector"];
})();