describe('EndToEndFixtures', function() {
    var provider;

    beforeEach(module('TestModel'));
    beforeEach(module('TestUsersFixture'));

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('');
        provider.headResponseHeaderPrefix('X-');
        provider.endpoint('users_fixtures')
            .route('/users/:id/:controller/:action')
            .fixture('TestUsersFixture')
            .model('TestModel');
    }));

    it('tests to get a resource and map it', inject(function($injector, TestModel) {
        var api = provider.$get($injector);

        api.users_fixtures.get().then(function(users) {
            console.log(users);
            expect(users[0] instanceof TestModel).toBe(true);
            expect(users[0].fullname).toBe('Jack Bauer');
            expect(users[1].fullname).toBe('Sandra Bullock');
        });
    }));
});