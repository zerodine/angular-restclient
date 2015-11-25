describe('endpointInterface', function() {
    var endpointTestNotImplemented;
    var endpointTest;

    beforeEach(function() {
        function EndpointTestNotImplemented() {}
        angular.extend(EndpointTestNotImplemented.prototype, EndpointInterface.prototype);
        endpointTestNotImplemented = new EndpointTestNotImplemented();

        function EndpointTest() {}
        angular.extend(EndpointTest.prototype, EndpointInterface.prototype);
        EndpointTest.prototype.get = function() { return true};
        EndpointTest.prototype.post = function() { return true};
        EndpointTest.prototype.delete = function() { return true};
        EndpointTest.prototype.put = function() { return true};
        EndpointTest.prototype.head = function() { return true};
        endpointTest = new EndpointTest();
    });

    it('get', function() {
        expect(endpointTest.get).not.toThrowError('Not Implemented');
        expect(endpointTest.get).toBeTruthy();
        expect(endpointTestNotImplemented.get).toThrowError('Not Implemented');
    });

    it('post', function() {
        expect(endpointTest.post).not.toThrowError('Not Implemented');
        expect(endpointTest.post).toBeTruthy();
        expect(endpointTestNotImplemented.post).toThrowError('Not Implemented');
    });

    it('delete', function() {
        expect(endpointTest.delete).not.toThrowError('Not Implemented');
        expect(endpointTest.delete).toBeTruthy();
        expect(endpointTestNotImplemented.delete).toThrowError('Not Implemented');
    });

    it('put', function() {
        expect(endpointTest.put).not.toThrowError('Not Implemented');
        expect(endpointTest.put).toBeTruthy();
        expect(endpointTestNotImplemented.put).toThrowError('Not Implemented');
    });

    it('head', function() {
        expect(endpointTest.head).not.toThrowError('Not Implemented');
        expect(endpointTest.head).toBeTruthy();
        expect(endpointTestNotImplemented.head).toThrowError('Not Implemented');
    });
});