angular.extend(EndpointFixture.prototype, EndpointAbstract.prototype);

function EndpointFixture(name, endpointConfig, $injector) {
    this.name = name;
    this.endpointConfig = endpointConfig;
    this.q = $injector.get('$q');
    this.fixture = $injector.get(endpointConfig.fixture);

    this.fixture = $injector.get(endpointConfig.fixture);
}

EndpointFixture.prototype.get = function(params) {
    var defer = this.q.defer();

    var paramsOrder = [];
    var regex = /:(\w+)/g;
    var param = regex.exec(this.endpointConfig.route);
    while (param != null) {
        paramsOrder.push(param[1]);
        param = regex.exec(this.endpointConfig.route);
    }

    var orderedParams = [];
    angular.forEach(paramsOrder, function(param) {
        if (angular.isObject(params) && angular.isDefined(params[param])) orderedParams.push(params[param]);
    });

    var fixture = new this.fixture;
    defer.resolve(fixture.fetch('GET', paramsOrder));

    return defer.promise;
};