describe('endpointAbstract', function() {
    var provider;
    var $httpBackend;

    beforeEach(module('UserModel'));
    beforeEach(module('CompanyModel'));
    beforeEach(module('RoleModel'));

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

    it('_mapResult', inject(function($injector, UserModel, CompanyModel, RoleModel) {

        // Array packed in object
        $httpBackend.whenGET('/users').respond({
            users: [
                {
                    id: 1,
                    firstname: 'Jack',
                    lastname: 'Bauer',
                    company: {
                        id: 1,
                        name: 'ACME'
                    },
                    roles: [
                        {
                            id: 1,
                            name: 'user'
                        }
                    ]
                },
                {
                    id: 2,
                    firstname: 'Homer',
                    lastname: 'Simpson',
                    company: {
                        id: 2,
                        name: 'Springfield Power Plant'
                    },
                    roles: [
                        {
                            id: 1,
                            name: 'user'
                        },
                        {
                            id: 2,
                            name: 'admin'
                        }
                    ]
                }
            ]
        });

        var api = provider.$get($injector);

        api.users.get().then(function(users) {
            expect(users[0] instanceof UserModel).toBe(true);
            expect(users[0].company instanceof CompanyModel).toBe(true);
            expect(users[0].roles[0] instanceof RoleModel).toBe(true);

            expect(users[1] instanceof UserModel).toBe(true);
            expect(users[1].company instanceof CompanyModel).toBe(true);
            expect(users[1].roles[0] instanceof RoleModel).toBe(true);
            expect(users[1].roles[1] instanceof RoleModel).toBe(true);

            expect(users[0].fullname).toBe('Jack Bauer');
            expect(users[1].fullname).toBe('Homer Simpson');

            expect(users[0].company.name).toBe('ACME');
            expect(users[1].company.name).toBe('Springfield Power Plant');

            expect(users[0].roles[0].name).toBe('user');
            expect(users[1].roles[0].name).toBe('user');
            expect(users[1].roles[1].name).toBe('admin');
        });

        $httpBackend.flush();
    }));

    it('_getPagination', inject(function($injector, UserModel, CompanyModel, RoleModel) {

        $httpBackend.whenGET('/users').respond({
            users: [
                {
                    id: 1,
                    firstname: 'Jack',
                    lastname: 'Bauer'
                },
                {
                    id: 2,
                    firstname: 'Homer',
                    lastname: 'Simpson'
                }
            ],
            count: 4,
            limit: 2,
            skip: 0
        });

        $httpBackend.whenGET('/users?_limit=2&_skip=0').respond({
            users: [
                {
                    id: 1,
                    firstname: 'Jack',
                    lastname: 'Bauer'
                },
                {
                    id: 2,
                    firstname: 'Homer',
                    lastname: 'Simpson'
                }
            ],
            count: 4,
            limit: 2,
            skip: 0
        });

        $httpBackend.whenGET('/users?_limit=2&_skip=2').respond({
            users: [
                {
                    id: 3,
                    firstname: 'Sandra',
                    lastname: 'Bullock'
                },
                {
                    id: 4,
                    firstname: 'Bart',
                    lastname: 'Simpson'
                }
            ],
            count: 4,
            limit: 2,
            skip: 2
        });

        var api = provider.$get($injector);

        api.users.get().then(function(users) {
            expect(users[0] instanceof UserModel).toBe(true);

            expect(users.pagination).toBeDefined();
            expect(users.pagination.count).toBe(4);
            expect(users.pagination.limit).toBe(2);
            expect(users.pagination.skip).toBe(0);
            expect(users.pagination.pagesArray.length).toBe(2);
            expect(users.pagination.pagesArray).toEqual([1, 2]);
            expect(users.pagination.pagesCount).toBe(2);
            expect(users.pagination.currentPage).toBe(1);
            expect(users.pagination.currentPageItemsCount).toBe(2);

            expect(users.next).toBeDefined();
            expect(users.previous).toBeDefined();

            users.next().then(function(users) {
                expect(users.pagination).toBeDefined();
                expect(users.pagination.count).toBe(4);
                expect(users.pagination.limit).toBe(2);
                expect(users.pagination.skip).toBe(2);
                expect(users.pagination.pagesArray.length).toBe(2);
                expect(users.pagination.pagesArray).toEqual([1, 2]);
                expect(users.pagination.pagesCount).toBe(2);
                expect(users.pagination.currentPage).toBe(2);
                expect(users.pagination.currentPageItemsCount).toBe(2);

                expect(users.next).toBeDefined();
                expect(users.previous).toBeDefined();

                users.previous().then(function(users) {
                    expect(users.pagination).toBeDefined();
                    expect(users.pagination.count).toBe(4);
                    expect(users.pagination.limit).toBe(2);
                    expect(users.pagination.skip).toBe(0);
                    expect(users.pagination.pagesArray.length).toBe(2);
                    expect(users.pagination.pagesArray).toEqual([1, 2]);
                    expect(users.pagination.pagesCount).toBe(2);
                    expect(users.pagination.currentPage).toBe(1);
                    expect(users.pagination.currentPageItemsCount).toBe(2);

                    expect(users.next).toBeDefined();
                    expect(users.previous).toBeDefined();
                });
            });
        });

        $httpBackend.flush();
    }));

    it('update', inject(function($injector, UserModel) {
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

        api.users.update({id: 1}, user).then(function(updatedUser) {
            expect(updatedUser.fullname).toBe('ElBarto Simpsons');
            expect(updatedUser instanceof UserModel).toBe(true);
        });

        $httpBackend.flush();
    }));

    it('save', inject(function($injector, UserModel) {
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

        api.users.save(user).then(function(createdUser) {
            expect(createdUser.fullname).toBe('Bart Simpsons');
            expect(createdUser instanceof UserModel).toBe(true);
        });

        $httpBackend.flush();
    }));

    it('remove with id', inject(function($injector) {
        $httpBackend.whenDELETE('/users/1').respond(200);

        var api = provider.$get($injector);

        api.users.remove({id: 1}).then(function() {
            expect(true).toBeTruthy;
        }, function() {
            expect(true).toBeFalsy();
        });

        $httpBackend.flush();
    }));

    it('remove with model', inject(function($injector, UserModel) {
        $httpBackend.whenDELETE('/users/1').respond(200);

        var api = provider.$get($injector);

        api.users.remove(new UserModel({id: 1})).then(function() {
            expect(true).toBeTruthy;
        }, function() {
            expect(true).toBeFalsy();
        });

        $httpBackend.flush();
    }));
});