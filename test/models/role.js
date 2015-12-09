(function() {
    angular.module('RoleModel', [])
        .factory('RoleModel', function(Model) {
            function RoleModel(object) {

                this.id = {
                    type: 'int',
                    save: false
                };

                this.name = {
                    type: 'string',
                    required: true
                };

                // Map the given object
                this._init(object);
            }

            angular.extend(RoleModel.prototype, Model.prototype);

            return RoleModel;
        })
})();