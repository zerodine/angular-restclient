angular.extend(EndpointAbstract.prototype, EndpointInterface.prototype);

/**
 * Abstract Endpoint class with all helper methods
 *
 * @class
 * @implements {EndpointInterface}
 */
function EndpointAbstract() {}

/**
 * Maps an object or array to the endpoint model
 *
 * @protected
 * @param {object} data Object or array of raw data
 * @return {Model|Array}
 * @abstract
 */
EndpointAbstract.prototype._mapResult = function(data) {
    var self = this;
    var result;
    self._log.debug("apiFactory (" + self._endpointConfig.name + "): Endpoint called");

    // Set the name of the wrapping container
    var container = self._endpointConfig.container;
    // Get the model object that is used to map the result
    var model = this._injector.get(self._endpointConfig.model);

    self._log.debug("apiFactory (" + self._endpointConfig.name + "): Container set to " + container);

    // Check if response is an array
    if (angular.isArray(data) || angular.isArray(data[container])) {
        self._log.debug("apiFactory (" + self._endpointConfig.name + "): Result is an array");

        var arrayData = angular.isArray(data) ? data : data[container];
        var models = [];

        // Iterate thru every object in the response and map it to a model
        angular.forEach(arrayData, function (value) {
            models.push(new model(value));
        });

        result = models;

    } else {
        self._log.debug("apiFactory (" + self._endpointConfig.name + "): Result is NOT an array");

        // If only one object is given, map it to the model
        result = new model(data);
    }

    self._log.debug("apiFactory (" + self._endpointConfig.name + "): Mapped result is:", result);

    return result;
};

/**
 * Extract the pagination data from the result
 *
 * @protected
 * @param {object} data Object or array of raw data
 * @return {object}
 * @abstract
 */
EndpointAbstract.prototype._getPagination = function(data) {
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

/**
 * @alias put
 */
EndpointAbstract.prototype.update = function() {
    return this.put.apply(this, arguments);
};

/**
 * @alias post
 */
EndpointAbstract.prototype.save = function() {
    return this.post.apply(this, arguments);
};

/**
 * @alias delete
 */
EndpointAbstract.prototype.remove = function() {
    return this.delete.apply(this, arguments);
};