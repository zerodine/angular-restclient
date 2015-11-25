describe('endpointMock', function() {
    var provider;

    beforeEach(module('UserModel'));
    beforeEach(module('UsersMock'));

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('');
        provider.headResponseHeaderPrefix('X-');
        provider.endpoint('users')
            .route('/users/:id')
            .model('UserModel')
            .mock('UsersMock');
    }));

    it('_extractParams', inject(function($injector) {
        var endpointConfig = new EndpointConfig('users');
        endpointConfig = endpointConfig.route('/users/:id/:controller/:action').mock('UsersMock');
        var endpointMock = new EndpointMock(endpointConfig, $injector);
        var orderedParams = endpointMock._extractParams({
            id: 1,
            controller: 'company',
            action: 'active'
        });

        expect(orderedParams[0]).toBe(1);
        expect(orderedParams[1]).toBe('company');
        expect(orderedParams[2]).toBe('active');

        orderedParams = endpointMock._extractParams({
            action: 'active',
            id: 1,
            controller: 'company'
        });

        expect(orderedParams[0]).toBe(1);
        expect(orderedParams[1]).toBe('company');
        expect(orderedParams[2]).toBe('active');

        orderedParams = endpointMock._extractParams({
            id: 1
        });

        expect(orderedParams[0]).toBe(1);
        expect(orderedParams[1]).not.toBe('company');
        expect(orderedParams[2]).not.toBe('active');
    }));

    it('get', inject(function($injector, UserModel) {
        var api = provider.$get($injector);

        // Multiple objects
        api.users.get().then(function(users) {
            expect(users[0] instanceof UserModel).toBe(true);
            expect(users[0].fullname).toBe('Jack Bauer');
            expect(users[1].fullname).toBe('Sandra Bullock');
        });

        // Single object
        api.users.get({id: 1}).then(function(user) {
            expect(user[0] instanceof UserModel).toBe(true);
            expect(user[0].fullname).toBe('Jack Bauer');
        });
    }));

    it('put', inject(function($injector, UserModel) {
        var api = provider.$get($injector);

        var user = new UserModel({
            id: 1,
            firstname: 'ElBarto',
            lastname: 'Simpsons'
        });

        api.users.put({id: 1}, user).then(function(updatedUser) {
            expect(updatedUser.id).toBe(1);
            expect(updatedUser.fullname).toBe('ElBarto Simpsons');
            expect(updatedUser instanceof UserModel).toBe(true);
        });
    }));

    it('post', inject(function($injector, UserModel) {
        var api = provider.$get($injector);

        var user = new UserModel({
            firstname: 'Bart',
            lastname: 'Simpsons'
        });

        api.users.post(user).then(function(createdUser) {
            expect(createdUser.id).toBe(1);
            expect(createdUser.fullname).toBe('Bart Simpsons');
            expect(createdUser instanceof UserModel).toBe(true);
        });
    }));
});