describe('api', function() {
    var provider;
    var $httpBackend;

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('http://localhost');
        provider.headResponseHeaderPrefix('X-');
        provider.endpoint('users')
            .route('/users/:id')
            .model('UserModel');
        provider.endpoint('companies')
            .route('/companies/:id')
            .baseRoute('http://127.0.0.1')
            .container('results')
            .model('CompanyModel');
    }));

    beforeEach(inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    it('endpoint', function() {
        expect(provider._endpoints['users'].name).toBe('users');
        expect(provider._endpoints['users'].model).toBe('UserModel');
        expect(provider._endpoints['users'].route).toBe('/users/:id');

        expect(provider._endpoints['companies'].name).toBe('companies');
        expect(provider._endpoints['companies'].model).toBe('CompanyModel');
        expect(provider._endpoints['companies'].baseRoute).toBe('http://127.0.0.1');
        expect(provider._endpoints['companies'].route).toBe('/companies/:id');
    });

    it('$get', inject(function($injector) {
        var api = provider.$get($injector);

        expect(api.users._endpointConfig.baseRoute).toBe('http://localhost');
        expect(api.companies._endpointConfig.baseRoute).toBe('http://127.0.0.1');

        expect(api.users._endpointConfig.container).toBe('users');
        expect(api.companies._endpointConfig.container).toBe('results');

        expect(api.users._endpointConfig.headResponseHeaderPrefix).toBe('X-');
    }));
});