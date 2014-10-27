var styles, scripts, config, themeScripts, themeStyles, path,
    inc = include;
(function () {

    var log = new Log();

    var context = {
        scripts: {},
        styles: {}
    };

    var baseDir = '/components';

    var configDir = '/configs';

    var compFile = function (comp, path) {
        return baseDir + '/' + comp + '/' + path;
    };

    var styleSource = function (path) {
        return '<link rel="stylesheet" href="' + path + '" media="screen">';
    };

    var scriptSource = function (path) {
        return '<script src="' + path + '"></script>';
    };

    var pakage = function (comp) {
        var path = compFile(comp, 'package.json');
        if (!new File(path).isExists()) {
            throw 'Cannot find package.json of the component ' + comp;
        }
        return require(path);
    };

    var styleDependencies = function (comp, config) {
        var dependency,
            dependencies = config.dependencies;
        if (dependencies) {
            for (dependency in dependencies) {
                if (!dependencies.hasOwnProperty(dependency)) {
                    continue;
                }
                //get rid of already added styles
                if (context.styles[dependency]) {
                    return;
                }
                styleDependencies(dependency, pakage(dependency));
                context.styles[dependency] = true;
            }
        }
        if (!config.styles) {
            return;
        }
        config.styles.forEach(function (style) {
            print(styleSource(component.path(style, comp)));
        });
    };

    var scriptDependencies = function (comp, config) {
        var dependency,
            dependencies = config.dependencies;
        if (dependencies) {
            for (dependency in dependencies) {
                if (!dependencies.hasOwnProperty(dependency)) {
                    continue;
                }
                //get rid of already added styles
                if (context.scripts[dependency]) {
                    return;
                }
                scriptDependencies(dependency, pakage(dependency));
                context.scripts[dependency] = true;
            }
        }
        if (!config.scripts) {
            return;
        }
        config.scripts.forEach(function (style) {
            print(scriptSource(component.path(style, comp)));
        });
    };


    styles = function (comp, sub) {
        styleDependencies(comp, pakage(comp));
        var path = compFile(comp, 'styles.jag');
        if (!new File(path).isExists()) {
            return;
        }
        inc(path);
    };

    scripts = function (comp, sub) {
        scriptDependencies(comp, pakage(comp));
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
            print(scriptSource(path));
        }
    };

    themeStyles = function () {
        var opts = config('theme');
        var theme = opts.active;
        var path = '/themes/' + theme + '/css/styles.css';
        if (new File(path).isExists()) {
            print(styleSource(path));
        }
    };

    /**
     *
     * /a       /a/b    ->  ./a/b
     * /a/      /a/b    -> ./a/b
     * /a/b     /a/b/c  -> ./b/c
     * /a/b/c   /a/b/c/d    -> ./c/d
     * /a       /b      -> ./b
     * /a/b     /a/b/c  -> ./b/c
     * /a/b     /c/d    -> ./c/d
     * /a/b     /a/c    -> ./c
     *
     * @param path
     * @param comp
     * @returns {string}
     */
    path = function (path, comp) {
        var current = request.getRequestURI();
        path = comp ? compFile(comp, path) : path;
        return '/caramel' + path; //TODO handle this to return relative paths always
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