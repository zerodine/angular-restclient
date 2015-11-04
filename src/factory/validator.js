angular
    .module('restclient')
    .factory('Validator', ValidatorFactory);

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
    };
}