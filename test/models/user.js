(function() {
    angular.module('UserModel', [])
        .factory('UserModel', function(Model) {
            function UserModel(object) {

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

                this.method = {
                    type: 'string',
                    save: false
                };

                this.company = {
                    type: 'relation',
                    relation: {
                        type: 'one',
                        model: 'CompanyModel'
                    },
                    save: 'reference'
                };

                this.roles = {
                    type: 'relation',
                    relation: {
                        type: 'many',
                        model: 'RoleModel'
                    }
                };

                // Map the given object
                this._init(object);
            }

            angular.extend(UserModel.prototype, Model.prototype);

            UserModel.prototype._afterLoad = function() {
                this.fullname = this._foreignData['firstname'] + ' ' + this._foreignData['lastname'];
                this.method = this._method;
            };

            UserModel.prototype._beforeSave = function() {
                this.firstname = this.firstname + '_';
            };

            return UserModel;
        })
})();