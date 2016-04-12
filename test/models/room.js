(function() {
    angular.module('RoomModel', [])
        .factory('RoomModel', function(Model) {
            function RoomModel(object) {

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

            angular.extend(RoomModel.prototype, Model.prototype);

            return RoomModel;
        })
})();