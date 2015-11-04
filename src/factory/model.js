angular
    .module('restclient')
    .factory('Model', ModelFactory);

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

        $log.debug("Model (" + this.constructor.name + "): Original response object is:", this.__foreignData);

        for (var property in this) {
            // If property is a method, then continue
            if (!this.hasOwnProperty(property)) continue;
            if (['__foreignData', '__annotation'].indexOf(property) > -1) continue;

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

            // Check if property is null
            if (this[property] === null) {
                delete this[property];
                continue;
            }

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
                if (angular.isDefined(this.__annotation[property].required) && (this.__annotation[property].required && this[property] === null || this.__annotation[property].required && this[property] === '')) return false;
                if (!Validator[this.__annotation[property].type](this[property]) && this.__annotation[property].required) return false;
            }
        }

        return true;
    };

    return Model;
}