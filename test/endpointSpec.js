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

        expect(api.users.endpointName).toBe('users');
        expect(api.users.endpointConfig.model).toBe('User');
    }));
});