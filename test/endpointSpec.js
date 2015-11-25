describe('endpoint', function() {
    var provider;
    var $httpBackend;

    beforeEach(module('UserModel'));

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('');
        provider.headResponseHeaderPrefix('X-');
        provider.endpoint('users')
            .route('/users/:id')
            .model('UserModel');
    }));

    beforeEach(inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    it('get', inject(function($injector, UserModel) {

        // Array packed in object
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
            expect(users[0] instanceof UserModel).toBe(true);
            expect(users[0].fullname).toBe('Jack Bauer');
            expect(users[1].fullname).toBe('Sandra Bullock');
        });

        $httpBackend.flush();

        // Array
        $httpBackend.whenGET('/users').respond([
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
        ]);

        api.users.get().then(function(users) {
            expect(users[0] instanceof UserModel).toBe(true);
            expect(users[0].fullname).toBe('Jack Bauer');
        });

        $httpBackend.flush();

        // Single object
        $httpBackend.whenGET('/users/1').respond([
            {
                id: 1,
                firstname: 'Jack',
                lastname: 'Bauer'
            }
        ]);

        api.users.get({id: 1}).then(function(user) {
            expect(user[0] instanceof UserModel).toBe(true);
            expect(user[0].fullname).toBe('Jack Bauer');
        });

        $httpBackend.flush();
    }));


    it('head', inject(function($injector) {
        $httpBackend.whenHEAD('/users').respond(201, {}, {'X-Count': '5'});

        var api = provider.$get($injector);

        api.users.head().then(function(usersHead) {
            expect(usersHead.count).toBe('5');
            expect(usersHead['x-count']).toBe('5');
        });

        $httpBackend.flush();
    }));

    it('put', inject(function($injector, UserModel) {
        $httpBackend.whenPUT('/users/1', {
            firstname: 'ElBarto_',
            lastname: 'Simpsons'
        }).respond(200, {
            id: 1,
            firstname: 'ElBarto',
            lastname: 'Simpsons'
        });

        var api = provider.$get($injector);

        var user = new UserModel({
            id: 1,
            firstname: 'ElBarto',
            lastname: 'Simpsons'
        });

        api.users.put({id: 1}, user).then(function(updatedUser) {
            expect(updatedUser.fullname).toBe('ElBarto Simpsons');
            expect(updatedUser instanceof UserModel).toBe(true);
        });

        $httpBackend.flush();
    }));

    it('post', inject(function($injector, UserModel) {
        $httpBackend.whenPOST('/users', {
            firstname: 'Bart_',
            lastname: 'Simpsons'
        }).respond(200, {
            id: 1,
            firstname: 'Bart',
            lastname: 'Simpsons'
        });

        var api = provider.$get($injector);

        var user = new UserModel({
            id: 1,
            firstname: 'Bart',
            lastname: 'Simpsons'
        });

        api.users.post(user).then(function(createdUser) {
            expect(createdUser.fullname).toBe('Bart Simpsons');
            expect(createdUser instanceof UserModel).toBe(true);
        });

        $httpBackend.flush();
    }));

    it('delete', inject(function($injector, UserModel) {
        $httpBackend.whenDELETE('/users').respond(200);

        var api = provider.$get($injector);

        api.users.delete({id: 1}).then(function() {
            expect(true).toBeTruthy;
        }, function() {
            expect(true).toBeFalsy();
        });

        $httpBackend.flush();
    }));
});