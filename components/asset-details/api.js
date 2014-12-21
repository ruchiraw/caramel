var log = new Log();
var asset = function () {
    var matcher = new URIMatcher(request.getRequestURI());
    var asset, id;
    if (!matcher.match('/{ctx}/assets/{id}')) {
        return null;
    }
    id = matcher.elements().id;
    asset = {
        id: id,
        name: (parseInt(id) % 2) ? 'Google Search' : 'Yahoo Search',
        description: 'This is a search gadget by WSO2.'
    };
    return asset;
};