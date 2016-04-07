(function() {
    angular.module('CompanyModel', [])
        .factory('CompanyModel', function(Model) {
            function CompanyModel(object) {

                this.id = {
                    type: 'int',
                    save: false
                };

                this.name = {
                    type: 'string',
                    required: true
                };

                this.computed_name = {
                    type: 'string',
                    save: false
                };

                this.location = {
                    type: 'relation',
                    relation: {
                        type: 'one',
                        model: 'LocationModel'
                    }
                };

                this.users = {
                    type: 'relation',
                    relation: {
                        type: 'many',
                        model: 'UserModel'
                    },
                    save: {
                        post: false,
                        put: 'reference'
                    }
                };

                // Map the given object
                this._init(object);
            }

            angular.extend(CompanyModel.prototype, Model.prototype);

            return CompanyModel;
        })
})();