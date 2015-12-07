(function() {
    angular.module('LocationModel', [])
        .factory('LocationModel', function(Model) {
            function LocationModel(object) {

                this.id = {
                    type: 'string',
                    save: false
                };

                this.city = {
                    type: 'string'
                };

                // Map the given object
                this._init(object);
            }

            angular.extend(LocationModel.prototype, Model.prototype);

            return LocationModel;
        })
})();