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