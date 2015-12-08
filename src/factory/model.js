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
                        continue;
                    }
                }
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
     * Validates the properties of the model.
     */
    Model.prototype.isValid = function() {
        var validator = new Validator();

        for (var property in this) {
            // If property is a method, then continue
            if (!this.hasOwnProperty(property)) continue;

            if (angular.isDefined(this._annotation[property])) {
                if (angular.isDefined(this._annotation[property].required) && (this._annotation[property].required && this[property] === null || this._annotation[property].required && this[property] === '')) return false;
                if (!validator[this._annotation[property].type](this[property])) return false;
            }
        }

        return true;
    };

    Model.prototype.validate = function() {
        var validator = new Validator();
        var valid = true;
        var errors = {};

        for (var property in this) {
            // If property is a method, then continue
            if (!this.hasOwnProperty(property)) continue;

            if (angular.isDefined(this._annotation[property])) {
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
                else if (!angular.isDefined(this._annotation[property].required) && this[property] === null) {
                    // Not required and null
                }
                else if (this._annotation[property].type == 'relation' && this._annotation[property].relation.type == 'one') {

                    if (!this[property].validate().valid) {
                        valid = false;
                        errors[property] = this[property].validate().errors;
                    }
                }
                else {
                   if(!validator[this._annotation[property].type](this[property])) {
                       valid = false;
                       errors[property] = 'format_error_' + this._annotation[property].type;
                   }
                }
            }
        }

        return {
            valid: valid,
            errors: errors
        }
    };

    return Model;
}