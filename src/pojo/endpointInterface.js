/**
 * Used to make sure that all HTTP/1.1 methods are implemented
 *
 * @interface
 * @class
 */
function EndpointInterface() {}

/**
 * HTTP/1.1 GET method
 */
EndpointInterface.prototype.get = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 POST method
 */
EndpointInterface.prototype.post = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 DELETE method
 */
EndpointInterface.prototype.delete = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 PUT method
 */
EndpointInterface.prototype.put = function() { throw new Error('Not Implemented'); };

/**
 * HTTP/1.1 HEAD method
 */
EndpointInterface.prototype.head = function() { throw new Error('Not Implemented'); };