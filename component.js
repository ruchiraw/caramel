var styles, scripts, config,
    inc = include;
(function () {

    var log = new Log();

    var baseDir = '/components';

    var configDir = '/configs';

    var compFile = function (comp, path) {
        return baseDir + '/' + comp + '/' + path;
    };

    styles = function (comp, sub) {
        var path = compFile(comp, 'styles.jag');
        if (!new File(path).isExists()) {
            return;
        }
        inc(path);
    };

    scripts = function (comp, sub) {
        var path = compFile(comp, 'scripts.jag');
        if (!new File(path).isExists()) {
            return;
        }
        inc(path);
    };

    config = function (comp) {
        var path = configDir + '/' + comp + '.json';
        return new File(path).isExists() ? require(path) : {};
    };

    themeScripts = function () {
        var opts = config('theme');
        var theme = opts.active;
        var path = '/themes/' + theme + '/js/scripts.js';
        if (new File(path).isExists()) {
            print('<script src="/caramel"' + path + '"></script>');
        }
    };

    themeStyles = function () {
        var opts = config('theme');
        var theme = opts.active;
        var path = '/themes/' + theme + '/css/styles.css';
        if (new File(path).isExists()) {
            print('<link href="/caramel"' + path + '" rel="stylesheet"/>');
        }
    };

    var exists = function (path) {
        return new File(path).isExists();
    };

    var getPath = function (comp, sub) {
        var path;
        if (sub) {
            path = compFile(comp, sub + '/index.jag');
            if (exists(path)) {
                return path;
            }
            path = compFile(comp, sub + '.jag');
            if (exists(path)) {
                return path;
            }
        }
        path = compFile(comp, 'index.jag');
        if (exists(path)) {
            return path;
        }
        throw 'Included sub component:' + sub + ' cannot be found under component: ' + comp;
    };

    include = function (comp, sub, data) {
        var path;
        if (typeof sub === 'string' || sub instanceof String) {
            path = getPath(comp, sub);
        } else {
            path = getPath(comp, null);
            data = sub;
        }
        data ? inc(path, data) : inc(path);
    };

}());