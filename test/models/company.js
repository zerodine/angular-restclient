(function() {
    angular.module('CompanyModel', [])
        .factory('CompanyModel', function(Model) {
            function CompanyModel(object) {

                this.id = {
                    type: 'string',
                    save: false
                };

                this.name = {
                    type: 'string'
                };

                // Map the given object
                this._init(object);
            }

            angular.extend(CompanyModel.prototype, Model.prototype);

            return CompanyModel;
        })
})();