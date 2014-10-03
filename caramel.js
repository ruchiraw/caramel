var log = new Log();

var statik = function (req, res, path) {
    //TODO: optimize this
    var file;
    if (path.match(/(.js)$/ig)) {
        //js file
        file = new File(path);
        if (!file.isExists() || file.isDirectory()) {
            return false;
        }
        res.contentType = 'application/javascript';
        print(file.getStream());
        return true;
    }
    if (path.match(/(.css)$/ig)) {
        //css file
        file = new File(path);
        if (!file.isExists() || file.isDirectory()) {
            return false;
        }
        res.contentType = 'text/css';
        print(file.getStream());
        return true;
    }
    return false;
};

var serve = function (req, res) {
    var file;
    var path = req.getRequestURI();
    var context = req.getContextPath();
    path = path.substring(context.length);
    if (statik(req, res, path)) {
        return;
    }
    var modsDir = new File('/modules');
    if (!modsDir.isExists() || !modsDir.isDirectory()) {
        log.error('modules directory cannot found');
        return;
    }
    var modules = [];
    var modList = modsDir.listFiles();
    var blks = {};
    var module, blocksDir, pagesDir, block, blockName, blocks, blockLength, feeder, template;
    modList.forEach(function (mod) {
        if (!mod.isDirectory()) {
            return;
        }
        module = require('/modules/' + mod.getName() + '/module.json');
        module.blocks = [];
        blocksDir = new File(mod.getPath() + '/blocks');
        if (blocksDir.isExists() && blocksDir.isDirectory()) {
            blocks = blocksDir.listFiles();
            blockLength = blocks.length;
            blocks.forEach(function (blockDir) {
                blockName = blockDir.getName();
                feeder = '/modules/' + module.name + '/blocks/' + blockName + '/index.js';
                template = '/modules/' + module.name + '/blocks/' + blockName + '/index.jag';
                if (!new File(feeder).isExists()) {
                    feeder = null;
                }
                block = {
                    name: blockName,
                    module: module.name,
                    feeder: feeder,
                    template: template
                };
                module.blocks.push(block);
                blks[block.name] = block;
            });
        }
        pagesDir = new File(mod.getPath() + '/pages');
        if (pagesDir.isExists() && pagesDir.isDirectory()) {
            module.pagesDir = pagesDir.getPath();
        }
        //print(module);
        //TODO: sort modules by weight
        modules.push(module);
    });
    __modules__ = modules;
    __blocks__ = blks;
    modules.every(function (module) {
        if (!module.pagesDir) {
            return true;
        }
        log.debug(module.pagesDir + path);
        file = new File(module.pagesDir + path);
        if (!file.isExists()) {
            //TODO: is this correct
            file = new File(module.pagesDir + path + '.jag');
            if (!file.isExists()) {
                return true;
            }
        }
        if (file.isDirectory()) {
            //TODO: handle index.jag
        }
        log.debug('/modules/' + module.name + '/pages/' + file.getName());
        include('/modules/' + module.name + '/pages/' + file.getName(), blks);
        return false;
    });
};

var layout = function (name) {
    //TODO: get active theme
    var theme = 'basic';
    var path = layoutFile(theme, name);
    var layout = new File(path);
    if (!layout.isExists()) {
        log.debug('specified layout ' + name + ' cannot be found in theme ' + theme + ', using default layout');
        path = layoutFile(theme, 'index');
    }
    return (function (layout) {
        var areas = {};
        var area = function (name) {
            var aria = areas[name];
            if (aria) {
                return aria;
            }
            aria = (areas[name] = []);
            aria.add = function (block, options) {
                var area = areas[name];
                area.push({
                    block: __blocks__[block],
                    options: options || {}
                });
                return area;
            };
            aria.area = area;
            aria.render = function () {
                //we have all the blocks in areas object
                areas.render = function (o) {
                    var data = {};
                    var block = o.block;
                    var feeder = block.feeder;
                    if (feeder) {
                        feeder = require(feeder);
                        data = feeder.run ? feeder.run({
                            req: request,
                            res: response,
                            ses: session,
                            app: application
                        }, o.options) : data;
                    }
                    include(o.block.template, data);
                };
                areas.blocks = function(block) {
                    return areas[block] || [];
                };
                //print(areas);
                include(layout, areas);
            };
            return aria;
        };
        return {
            area: area
        };
    }(path));
};

var layoutFile = function (theme, layout) {
    return '/themes/' + theme + '/layouts/' + layout + '.jag';
};

/**
 if we have blocks at top, then a block with just hooks doesn't fit there
 as users will see no difference between a block with uis and a block with
 just hooks

 at the moment, block names are in a single namespace, but would be better to qualify them
 with the module name
 */