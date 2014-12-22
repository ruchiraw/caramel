var log = new Log();
var asset = function () {
    var matcher = new URIMatcher(request.getRequestURI());
    var assets, id;
    if (!matcher.match('/{ctx}/assets/{id}')) {
        return null;
    }
    id = parseInt(matcher.elements().id, 10);
    assets = component.api('asset-list').assets();
    if (id >= assets.length) {
        return null;
    }
    return assets[id];
};