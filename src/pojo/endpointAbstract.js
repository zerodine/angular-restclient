angular.extend(EndpointAbstract.prototype, EndpointInterface.prototype);

function EndpointAbstract() {}

/**
 * Maps an object or array to the endpoint model
 *
 * @private
 * @param {object} data Object or array of raw data
 * @return {Model|Array}
 * @memberof EndpointAbstract
 */
EndpointAbstract.prototype.mapResult = function(data) {
    var self = this;
    var result;
    self.log.debug("apiFactory (" + self.endpointConfig.name + "): Endpoint called");

    // Set the name of the wrapping container
    var container = self.endpointConfig.container;
    // Get the model object that is used to map the result
    var model = this.injector.get(self.endpointConfig.model);

    self.log.debug("apiFactory (" + self.endpointConfig.name + "): Container set to " + container);

    // Check if response is an array
    if (angular.isArray(data) || angular.isArray(data[container])) {
        self.log.debug("apiFactory (" + self.endpointConfig.name + "): Result is an array");

        var arrayData = angular.isArray(data) ? data : data[container];
        var models = [];

        // Iterate thru every object in the response and map it to a model
        angular.forEach(arrayData, function (value) {
            models.push(new model(value));
        });

        result = models;

    } else {
        self.log.debug("apiFactory (" + self.endpointConfig.name + "): Result is NOT an array");

        // If only one object is given, map it to the model
        result = new model(data);
    }

    self.log.debug("apiFactory (" + self.endpointConfig.name + "): Mapped result is:", result);

    return result;
};

/**
 * Extract the pagination data from the result
 *
 * @private
 * @param {object} data Object or array of raw data
 * @return {object}
 * @memberof EndpointAbstract
 */
EndpointAbstract.prototype.getPagination = function(data) {
    if (
        angular.isDefined(data.count) &&
        angular.isDefined(data.limit) &&
        angular.isDefined(data.skip) &&
        data.limit > 0
    ) {
        // Calc the number of pages and generate array
        data.pagesArray = [];

        var pages = data.count / data.limit;
        if (pages % 1 !== 0) pages = Math.ceil(pages);

        var currentPage = parseInt(data.skip / data.limit + 1);
        var currentPageItemsCount = data.limit;
        if (data.skip+1+data.limit > data.count) {
            if (currentPage == 1) {
                currentPageItemsCount = data.limit;
            } else {
                currentPageItemsCount = data.count - ((currentPage-1)*data.limit);
            }
        }

        var i;
        if (currentPage <= 5) {
            for (i=1; i<=11; i++) data.pagesArray.push(i);
        } else if (currentPage >= pages-5) {
            for (i=pages-11; i<=pages; i++) data.pagesArray.push(i);
        } else {
            for (i=currentPage-5; i<=currentPage+5; i++) data.pagesArray.push(i);
        }


        return {
            count: data.count,
            limit: data.limit,
            skip: data.skip,
            pagesArray: data.pagesArray,
            pagesCount: pages,
            currentPage: currentPage,
            currentPageItemsCount: currentPageItemsCount
        };
    }

    return null;
};

EndpointAbstract.prototype.update = function() {
    return this.put.apply(this, arguments);
};

EndpointAbstract.prototype.save = function() {
    return this.post.apply(this, arguments);
};

EndpointAbstract.prototype.remove = function() {
    return this.delete.apply(this, arguments);
};