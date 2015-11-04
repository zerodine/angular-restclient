describe('EndToEndMocks', function() {
    var provider;

    beforeEach(module('TestModel'));
    beforeEach(module('TestUsersMock'));

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('');
        provider.headResponseHeaderPrefix('X-');
        provider.endpoint('users_fixtures')
            .route('/users/:id/:controller/:action')
            .mock('TestUsersMock')
            .model('TestModel')
            .container('users');
    }));

    it('tests to get a resource and map it', inject(function($injector, TestModel) {
        var api = provider.$get($injector);

        api.users_fixtures.get().then(function(users) {
            expect(users[0] instanceof TestModel).toBe(true);
            expect(users[0].fullname).toBe('Jack Bauer');
            expect(users[1].fullname).toBe('Sandra Bullock');
        });

        $injector.get('$rootScope').$apply();
    }));

    it('tests to get a specific resource and map it', inject(function($injector, TestModel) {
        var api = provider.$get($injector);

        api.users_fixtures.get({id: 1}).then(function(user) {
            expect(user instanceof TestModel).toBe(true);
            expect(user.fullname).toBe('Jack Bauer');
            expect(user.fullname).not.toBe('Sandra Bullock');
        });

        $injector.get('$rootScope').$apply();
    }));

    it('tests to post a specific resource and map it', inject(function($injector, TestModel) {
        var api = provider.$get($injector);

        var user = {
            firstname: 'Bart',
            lastname: 'Simpsons'
        };

        api.users_fixtures.save(new TestModel(user)).then(function(user) {
            expect(user instanceof TestModel).toBe(true);
            expect(user.id).toBe(3);
            expect(user.fullname).toBe('Bart_ Simpsons');
            expect(user.fullname).not.toBe('Sandra Bullock');
        });

        $injector.get('$rootScope').$apply();
    }));

    it('tests to post a specific resource with id and controller and map it', inject(function($injector, TestModel) {
        var api = provider.$get($injector);

        var user = {
            firstname: 'Bart',
            lastname: 'Simpsons'
        };

        api.users_fixtures.save({id: 3, controller: 'company'}, new TestModel(user)).then(function(user) {
            expect(user instanceof TestModel).toBe(true);
            expect(user.id).toBe(3);
            expect(user.fullname).toBe('Bart_ Simpsons');
            expect(user.fullname).not.toBe('Sandra Bullock');
        });

        $injector.get('$rootScope').$apply();
    }));

    it('tests to put a specific resource and map it', inject(function($injector, TestModel) {
        var api = provider.$get($injector);

        var user = {
            firstname: 'Bart',
            lastname: 'Simpsons'
        };

        api.users_fixtures.update({id: 1}, new TestModel(user)).then(function(user) {
            expect(user instanceof TestModel).toBe(true);
            expect(user.id).toBe(1);
            expect(user.fullname).toBe('Bart_ Simpsons');
            expect(user.fullname).not.toBe('Sandra Bullock');
        });

        $injector.get('$rootScope').$apply();
    }));
});