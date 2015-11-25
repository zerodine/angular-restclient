(function() {
    angular.module('RoleModel', [])
        .factory('RoleModel', function(Model) {
            function RoleModel(object) {

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

            angular.extend(RoleModel.prototype, Model.prototype);

            return RoleModel;
        })
})();