/**
 * This is just a helper function because a merge is not supported by angular until version > 1.4
 *
 * @deprecated Will be supported by angular with version > 1.4
 * @param dst
 * @param src
 * @returns {*}
 */
function merge(dst, src) {
    if (!angular.isDefined(dst) && !angular.isDefined(src)) return {};
    if (!angular.isDefined(dst)) return src;
    if (!angular.isDefined(src)) return dst;

    // Use angular merge if angular version >= 1.4
    if (angular.isDefined(angular.merge)) return angular.merge(dst, src);

    var h = dst.$$hashKey;

    if (!angular.isObject(src) && !angular.isFunction(src)) return;
    var keys = Object.keys(src);
    for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src_new = src[key];

        if (angular.isObject(src_new)) {
            if (!angular.isObject(dst[key])) dst[key] = angular.isArray(src_new) ? [] : {};
            this(dst[key], src_new);
        } else {
            dst[key] = src_new;
        }
    }

    if (h) {
        dst.$$hashKey = h;
    } else {
        delete dst.$$hashKey;
    }

    return dst;
}