describe('Mapping', function() {
    var provider;

    beforeEach(module('TestModel'));
    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('/');
        provider.endpoint('users')
            .route('/users')
            .model('TestModel');
    }));

    it('tests the object mapping process', inject(function($injector) {
        var api = provider.$get($injector);

        var testModel = api.users.mapResult({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer',
            shouldNotMap: 'BLUBB'
        });
        expect(testModel.firstname).toBe('Jack');
        expect(testModel.lastname).toBe('Bauer');
        expect(testModel.id).toEqual(1);
        expect(testModel.shouldNotMap).toBeUndefined();
    }));

    it('tests after load method', inject(function($injector) {
        var api = provider.$get($injector);

        var testModel = api.users.mapResult({
            id: 1,
            firstname: 'Jack',
            lastname: 'Bauer'
        });
        expect(testModel.fullname).toBe('Jack Bauer');
        expect(testModel.id).toEqual(1);
    }));

    it('tests the array mapping process', inject(function($injector) {
        var api = provider.$get($injector);

        var testModels = api.users.mapResult({
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

        expect(testModels[0].firstname).toBe('Jack');
        expect(testModels[0].lastname).toBe('Bauer');
        expect(testModels[0].id).toEqual(1);
        expect(testModels[1].firstname).toBe('Sandra');
        expect(testModels[1].lastname).toBe('Bullock');
        expect(testModels[1].id).toEqual(2);
    }));
});