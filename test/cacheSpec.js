describe("cache", function() {
    var originalTimeout;
    var provider;
    var $httpBackend;
    var $injector;
    var UserModel;

    beforeEach(module('UserModel'));

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('');
        provider.headResponseHeaderPrefix('X-');
        provider.endpoint('users')
            .route('/users/:id')
            .model('UserModel');
    }));

    beforeEach(inject(function(_$httpBackend_, _$injector_, _UserModel_) {
        $httpBackend = _$httpBackend_;
        $injector = _$injector_;
        UserModel = _UserModel_;
    }));

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it("get", function(done) {

        // Array packed in object
        $httpBackend.expectGET('/users').respond({
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
            expect(users[1].fullname).toBe('Sandra Bullock');
        });

        $httpBackend.flush();

        setTimeout(function() {
            api.users.get().then(function(users) {
                expect(users[0] instanceof UserModel).toBe(true);
                expect(users[0].fullname).toBe('Jack Bauer');
                expect(users[1].fullname).toBe('Sandra Bullock');
            });

            done();
        }, 2000);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});