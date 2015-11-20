(function() {
    angular.module('TestModel', [])
        .factory('TestModel', function(Model) {
            function TestModel(object) {

                this.id = {
                    type: 'string',
                    save: false
                };

                this.firstname = {
                    type: 'string'
                };

                this.lastname = {
                    type: 'string'
                };

                this.fullname = {
                    type: 'string',
                    save: false
                };

                // Map the given object
                this._init(object);
            }

            angular.extend(TestModel.prototype, Model.prototype);

            TestModel.prototype._afterLoad = function() {
                this.fullname = this._foreignData['firstname'] + ' ' + this._foreignData['lastname'];
            };

            TestModel.prototype._beforeSave = function() {
                this.firstname = this.firstname + '_';
            };

            return TestModel;
        })
})();