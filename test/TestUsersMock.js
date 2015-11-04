(function() {
    angular.module('TestUsersMock', [])
        .factory('TestUsersMock', function(Mock) {
            angular.extend(TestUsersMock.prototype, Mock.prototype);

            function TestUsersMock() {
                this.routes({
                    '[GET]/': this.get,
                    '[GET]/:id': this.getUser,
                    '[POST]/': this.postUser,
                    '[POST]/:id/:controller': this.postUserCompany,
                    '[PUT]/:id': this.putUser
                })
            }

            TestUsersMock.prototype.get = function() {
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

            TestUsersMock.prototype.getUser = function(id) {
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

            TestUsersMock.prototype.postUser = function(request) {
                request.body.id = 3;
                return request.body;
            };

            TestUsersMock.prototype.postUserCompany = function(id, controller, request) {
                request.body.id = id;
                return request.body;
            };

            TestUsersMock.prototype.putUser = function(id, request) {
                request.body.id = id;
                return request.body;
            };

            return TestUsersMock;
        })
})();