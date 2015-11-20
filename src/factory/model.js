angular
    .module('restclient')
    .factory('Model', ModelFactory);

/**
 * @ngInject
 */
function ModelFactory($log, $injector, Validator) {

    /**
     * Abstract model class
     *
     * @class
     */
    function Model() {

        /**
         * Holds the original object as it was injected.
         * This gets deleted after the model is fully initialized.
         *
         * @type {object}
         * @protected
         * @example
         * ConcreteModel.prototype._afterLoad = function() {
         *      this.full_name = this._foreignData['first_name'] + ' ' + this._foreignData['last_name'];
         * };
         */
        this._foreignData = {};

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
     * This method gets called by the endpoint before the model is sent to the backend.
     * It removes all decorator methods and attributes from a model so its clean to be sent.
     */
    Model.prototype.clean = function() {
        // Call the beforeSave method on the model
        this._beforeSave();

        // Go thru every property of the model
        for (var property in this) {
            // Ckeck if property is a method
            if (!this.hasOwnProperty(property)) continue;

            // Check if property is null
            if (this[property] === null) {
                delete this[property];
                continue;
            }

            if (angular.isDefined(this._annotation[property]) && angular.isDefined(this._annotation[property].save)) {

                // Check if property should be deleted before model is saved
                if (!this._annotation[property].save) {
                    delete this[property];
                    continue;
                }

                // Check if property should only be a reference to another model
                if (this._annotation[property].save == 'reference') {
                    this._referenceOnly(this[property]);
                    continue;
                }
            }

            if (angular.isDefined(this._annotation[property]) && angular.isDefined(this._annotation[property].type)) {
                // If property is a relation then call the clean method of related models
                if (this._annotation[property].type == 'relation' && this[property] !== null) {

                    if (!angular.isDefined(this._annotation[property].relation.type)) continue;

                    if (this._annotation[property].relation.type == 'one') {

                        // Call the clean method on the related model
                        this[property].clean();
                        continue;
                    }

                    if (this._annotation[property].relation.type == 'many') {
                        angular.forEach(this[property], function(model) {

                            // Call the clean method on the related model
                            model.clean();
                        });
                    }
                }
            }
        }

        // Delete this two properties before model gets saved
        delete this.__method;
        delete this._annotation;
    };

    /**
     * This method gets called after the response was transformed into te model.
     * It's helpful when you want to remap attributes or make some changed.
     * To use it, just override it in the concrete model.
     *
     * @protected
     * @example
     * ConcreteModel.prototype._afterLoad = function() {
     *      this.activation_token = this.activation_token.toUpperCase();
     * };
     */
    Model.prototype._afterLoad = function() {};

    /**
     * This method gets called before a model gets sent to the backend.
     * It's helpful when you want to remap attributes or make some changed.
     * To use it, just override it in the concrete model.
     *
     * @protected
     * @example
     * ConcreteModel.prototype._beforeSave = function() {
     *      this.activation_token = this.activation_token.toLowerCase();
     * };
     */
    Model.prototype._beforeSave = function() {};

    /**
     * Every model must call this method in it's constructor. It in charge of mapping the given object to the model.
     *
     * @param {object} object The given object. This can come ether from the backend or created manually.
     * @protected
     */
    Model.prototype._init = function(object) {
        this._foreignData = object;
        this._annotation = {};

        $log.debug("Model (" + this.constructor.name + "): Original response object is:", this._foreignData);

        for (var property in this) {
            // If property is a method, then continue
            if (!this.hasOwnProperty(property)) continue;
            if (['_foreignData', '_annotation'].indexOf(property) > -1) continue;

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
                if (angular.isUndefined(this._foreignData[relation.foreignField])) continue;

                // If the foreign field is null, set the property to null
                if (this._foreignData[relation.foreignField] === null) {
                    this[property] = null;
                    continue;
                }

                // Check which relation typ is defined and map the data
                if (relation.type == 'many') this._mapArray(property, this._foreignData[relation.foreignField], relation.model);
                if (relation.type == 'one') this._mapProperty(property, this._foreignData[relation.foreignField], relation.model);
            }
        }

        this._afterLoad();
        delete this._foreignData;
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
     * Validates the properties of the model.
     */
    Model.prototype.isValid = function() {
        for (var property in this) {
            // If property is a method, then continue
            if (!this.hasOwnProperty(property)) continue;

            if (angular.isDefined(this._annotation[property])) {
                if (angular.isDefined(this._annotation[property].required) && (this._annotation[property].required && this[property] === null || this._annotation[property].required && this[property] === '')) return false;
                if (!Validator[this._annotation[property].type](this[property]) && this._annotation[property].required) return false;
            }
        }

        return true;
    };

    return Model;
}