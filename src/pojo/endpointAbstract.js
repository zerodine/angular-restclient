angular.extend(EndpointAbstract.prototype, EndpointInterface.prototype);

function EndpointAbstract() {}

EndpointAbstract.prototype.put = function() {
    return this.update.apply(this, arguments);
};

EndpointAbstract.prototype.post = function() {
    return this.save.apply(this, arguments);
};

EndpointAbstract.prototype.delete = function() {
    return this.remove.apply(this, arguments);
};