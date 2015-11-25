(function() {
    angular.module('UsersMock', [])
        .factory('UsersMock', function(Mock) {
            angular.extend(UsersMock.prototype, Mock.prototype);

            function UsersMock() {
                this._routes({
                    '[GET]/': this.get,
                    '[GET]/:id': this.getUser,
                    '[POST]/': this.postUser,
                    '[POST]/:id/:controller': this.postUserCompany,
                    '[PUT]/:id': this.putUser
                })
            }

            UsersMock.prototype.get = function() {
                return {
                    users: [
                        {
                            id: 1,
                            firstname: 'Jack',
                            lastname: 'Bauer'
                        },
                        {
                            id: 2,
                            firstname: 'Sandra',
                            lastname: 'Bullock'
                        }
                    ]
                }
            };

            UsersMock.prototype.getUser = function(id) {
                var users = {
                    1: {
                        id: 1,
                        firstname: 'Jack',
                        lastname: 'Bauer'
                    },
                    2: {
                        id: 2,
                        firstname: 'Sandra',
                        lastname: 'Bullock'
                    }
                };

                return users[id];
            };

            UsersMock.prototype.postUser = function(request) {
                request.body.id = 1;
                return request.body;
            };

            UsersMock.prototype.postUserCompany = function(id, controller, request) {
                request.body.id = id;
                return request.body;
            };

            UsersMock.prototype.putUser = function(id, request) {
                request.body.id = id;
                return request.body;
            };

            return UsersMock;
        })
})();