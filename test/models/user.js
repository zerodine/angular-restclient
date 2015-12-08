(function() {
    angular.module('UserModel', [])
        .factory('UserModel', function(Model) {
            function UserModel(object) {

                this.id = {
                    type: 'int',
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

                this.email = {
                    type: 'email',
                    required: true
                };

                this.computed_name = {
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

            UserModel.prototype._afterLoad = function(foreignData) {
                this.fullname = foreignData['firstname'] + ' ' + foreignData['lastname'];
            };

            UserModel.prototype._beforeSave = function() {
                this.firstname = this.firstname + '_';
            };

            return UserModel;
        })
})();