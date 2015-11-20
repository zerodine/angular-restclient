describe('Endpoint', function() {
    var provider;

    beforeEach(module('restclient', function(apiProvider) {
        provider = apiProvider;
        provider.baseRoute('/');
        provider.endpoint('users')
            .route('/users')
            .model('User');
    }));

    it('tests one endpoint config', inject(function($injector) {
        var api = provider.$get($injector);

        expect(api.users._endpointConfig.name).toBe('users');
        expect(api.users._endpointConfig.model).toBe('User');
    }));
});