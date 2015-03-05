describe('EndToEnd', function() {
    var provider;
    var $httpBackend;

    beforeEach(module('TestModel'));

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('');
        provider.headResponseHeaderPrefix('X-');
        provider.endpoint('users')
            .route('/users/:id')
            .model('TestModel');
    }));

    beforeEach(inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    it('tests to get a resource and map it', inject(function($injector, TestModel) {
        $httpBackend.whenGET('/users').respond({
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
        });

        var api = provider.$get($injector);

        api.users.get().then(function(users) {
            expect(users[0] instanceof TestModel).toBe(true);
            expect(users[0].fullname).toBe('Jack Bauer');
        });

        $httpBackend.flush();
    }));

    it('tests to "head" a resource and map it', inject(function($injector) {
        $httpBackend.whenHEAD('/users').respond(201, {}, {'X-Count': '5'});

        var api = provider.$get($injector);

        api.users.head().then(function(usersHead) {
            expect(usersHead.count).toBe('5');
            expect(usersHead['x-count']).toBe('5');
        });

        $httpBackend.flush();
    }));

    it('tests to save a model with the api', inject(function($injector, TestModel) {
        $httpBackend.expectPOST('/users', {
            firstname: 'Bart_',
            lastname: 'Simpsons'
        }).respond(200, {
            id: 1,
            firstname: 'Bart',
            lastname: 'Simpsons'
        });

        var api = provider.$get($injector);

        var user = new TestModel({
            id: 1,
            firstname: 'Bart',
            lastname: 'Simpsons'
        });

        api.users.save(user).then(function(createdUser) {
            expect(createdUser.fullname).toBe('Bart Simpsons');
            expect(createdUser instanceof TestModel).toBe(true);

        });

        $httpBackend.flush();
    }));

    it('tests to update a model with the api', inject(function($injector, TestModel) {
        $httpBackend.expectPUT('/users/1', {
            firstname: 'ElBarto_',
            lastname: 'Simpsons'
        }).respond(200, {
            id: 1,
            firstname: 'ElBarto',
            lastname: 'Simpsons'
        });

        var api = provider.$get($injector);

        var user = new TestModel({
            id: 1,
            firstname: 'ElBarto',
            lastname: 'Simpsons'
        });

        api.users.update({id: 1}, user).then(function(updatedUser) {
            expect(updatedUser.fullname).toBe('ElBarto Simpsons');
            expect(updatedUser instanceof TestModel).toBe(true);
        });

        $httpBackend.flush();
    }));
});