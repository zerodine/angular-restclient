(function() {
    angular.module('TestUsersFixture', [])
        .factory('TestUsersFixture', function(Fixture) {
            angular.extend(TestUsersFixture.prototype, Fixture.prototype);

            function TestUsersFixture() {
                this.routes({
                    '[GET]/': this.get,
                    '[GET]/:id': this.getUser
                })
            }

            TestUsersFixture.prototype.get = function() {
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

            TestUsersFixture.prototype.getUser = function(id) {
                return {
                    id: 1,
                    firstname: 'Jack',
                    lastname: 'Bauer'
                }
            };

            return TestUsersFixture;
        })
})();