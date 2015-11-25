describe('endpointConfig', function() {

    it('route', function() {
        var endpointConfig = new EndpointConfig('users');
        endpointConfig = endpointConfig.route('/users');

        expect(endpointConfig instanceof EndpointConfig).toBeTruthy();
        expect(endpointConfig.name).toBe('users');
        expect(endpointConfig.route).toBe('/users');
    });

    it('model', function() {
        var endpointConfig = new EndpointConfig('users');
        endpointConfig = endpointConfig.model('User');

        expect(endpointConfig instanceof EndpointConfig).toBeTruthy();
        expect(endpointConfig.name).toBe('users');
        expect(endpointConfig.model).toBe('User');
    });

    it('container', function() {
        var endpointConfig = new EndpointConfig('users');
        endpointConfig = endpointConfig.container('users');

        expect(endpointConfig instanceof EndpointConfig).toBeTruthy();
        expect(endpointConfig.name).toBe('users');
        expect(endpointConfig.container).toBe('users');
    });

    it('actions', function() {
        var endpointConfig = new EndpointConfig('users');
        endpointConfig = endpointConfig.actions({'POST': {}});

        expect(endpointConfig instanceof EndpointConfig).toBeTruthy();
        expect(endpointConfig.name).toBe('users');
        expect(endpointConfig.actions).toEqual({'POST': {}});
    });

    it('baseRoute', function() {
        var endpointConfig = new EndpointConfig('users');
        endpointConfig = endpointConfig.baseRoute('http://localhost');

        expect(endpointConfig instanceof EndpointConfig).toBeTruthy();
        expect(endpointConfig.name).toBe('users');
        expect(endpointConfig.baseRoute).toBe('http://localhost');
    });

    it('mock', function() {
        var endpointConfig = new EndpointConfig('users');
        endpointConfig = endpointConfig.mock('UserMock');

        expect(endpointConfig instanceof EndpointConfig).toBeTruthy();
        expect(endpointConfig.name).toBe('users');
        expect(endpointConfig.mock).toBe('UserMock');
    });
});