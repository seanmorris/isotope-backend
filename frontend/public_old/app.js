(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("curvature/access/UserRepository.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UserRepository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Repository2 = require('../base/Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserRepository = exports.UserRepository = function (_Repository) {
	_inherits(UserRepository, _Repository);

	function UserRepository() {
		_classCallCheck(this, UserRepository);

		return _possibleConstructorReturn(this, (UserRepository.__proto__ || Object.getPrototypeOf(UserRepository)).apply(this, arguments));
	}

	_createClass(UserRepository, null, [{
		key: 'getCurrentUser',
		value: function getCurrentUser(refresh) {
			return this.request(this.uri + 'current', false, false, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'logout',
		value: function logout() {
			return this.request(this.uri + 'logout', false, {}, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'uri',
		get: function get() {
			return _Config.Config.backend + '/user/';
		}
	}]);

	return UserRepository;
}(_Repository2.Repository);
  })();
});

require.register("curvature/base/Bindable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bindable = exports.Bindable = function () {
    function Bindable() {
        _classCallCheck(this, Bindable);
    }

    _createClass(Bindable, null, [{
        key: 'isBindable',
        value: function isBindable(object) {
            if (!object.___binding___) {
                return false;
            }

            return object.___binding___ === Bindable;
        }
    }, {
        key: 'makeBindable',
        value: function makeBindable(object) {

            if (!object || object.___binding___ || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object' || object instanceof Node) {
                return object;
            }

            Object.defineProperty(object, '___ref___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, 'bindTo', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___binding___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___bindingAll___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___isBindable___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___executing___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___stack___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___stackTime___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___before___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___after___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, 'toString', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___setCount___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___wrapped___', {
                enumerable: false,
                writable: true
            });

            object.___isBindable___ = Bindable;
            object.___wrapped___ = {};
            object.___binding___ = {};
            object.___bindingAll___ = [];
            object.bindTo = function (object) {
                return function (property) {
                    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                    if (callback == null) {
                        callback = property;
                        object.___bindingAll___.push(callback);
                        for (var i in object) {
                            callback(object[i], i, object, false);
                        }
                        return;
                    }

                    if (!object.___binding___[property]) {
                        object.___binding___[property] = [];
                    }

                    object.___binding___[property].push(callback);

                    callback(object[property], property, object, false);
                };
            }(object);

            object.___stack___ = [];
            object.___stackTime___ = [];
            object.___before___ = [];
            object.___after___ = [];
            object.___setCount___ = {};

            object.toString = function (object) {
                return function () {
                    if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object') {
                        return JSON.stringify(object);
                        return '[object]';
                    }

                    return object;
                };
            }(object);

            for (var i in object) {
                if (object[i] && _typeof(object[i]) == 'object' && !object[i] instanceof Node) {
                    object[i] = Bindable.makeBindable(object[i]);
                }
            }

            var set = function (object) {
                return function (target, key, value) {
                    if (target[key] === value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== object) {
                        return true;
                    }

                    // console.log(`Setting ${key}`, value);

                    if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && !(value instanceof Node)) {
                        if (value.___isBindable___ !== Bindable) {
                            value = Bindable.makeBindable(value);

                            for (var _i in value) {
                                if (value[_i] && _typeof(value[_i]) == 'object') {
                                    value[_i] = Bindable.makeBindable(value[_i]);
                                }
                            }
                        }
                    }

                    for (var _i2 in object.___bindingAll___) {
                        object.___bindingAll___[_i2](value, key, target, false);
                    }

                    var stop = false;

                    if (key in object.___binding___) {
                        for (var _i3 in object.___binding___[key]) {
                            if (object.___binding___[key][_i3](value, key, target, false) === false) {
                                stop = true;
                            }
                        }
                    }

                    if (!stop) {
                        target[key] = value;
                    }

                    if (!target.___setCount___[key]) {
                        target.___setCount___[key] = 0;
                    }

                    target.___setCount___[key]++;

                    var warnOn = 10;

                    if (target.___setCount___[key] > warnOn && value instanceof Object) {
                        console.log('Warning: Resetting bindable reference "' + key + '" to object ' + target.___setCount___[key] + ' times.');
                    }

                    return true;
                };
            }(object);

            var del = function (object) {
                return function (target, key) {
                    // console.log(key, 'DEL');

                    if (!(key in target)) {
                        return true;
                    }

                    for (var _i4 in object.___bindingAll___) {
                        object.___bindingAll___[_i4](undefined, key, target, true);
                    }

                    if (key in object.___binding___) {
                        for (var _i5 in object.___binding___[key]) {
                            object.___binding___[key][_i5](undefined, key, target, true);
                        }
                    }

                    if (Array.isArray(target)) {
                        target.splice(key, 1);
                    } else {
                        delete target[key];
                    }

                    return true;
                };
            }(object);

            var get = function (object) {
                return function (target, key) {
                    if (typeof target[key] == 'function') {

                        if (target.___wrapped___[key]) {
                            return target.___wrapped___[key];
                        }

                        target.___wrapped___[key] = function () {
                            target.___executing___ = key;

                            target.___stack___.unshift(key);
                            target.___stackTime___.unshift(new Date().getTime());

                            // console.log(`Start ${key}()`);

                            for (var _i6 in target.___before___) {
                                target.___before___[_i6](target, key, object);
                            }

                            var ret = target[key].apply(target, arguments);

                            for (var _i7 in target.___after___) {
                                target.___after___[_i7](target, key, object);
                            }

                            target.___executing___ = null;

                            var execTime = new Date().getTime() - target.___stackTime___[0];

                            if (execTime > 150) {
                                // console.log(`End ${key}(), took ${execTime} ms`);
                            }

                            target.___stack___.shift();
                            target.___stackTime___.shift();

                            return ret;
                        };

                        return target.___wrapped___[key];
                    }

                    // console.log(`Getting ${key}`);

                    return target[key];
                };
            }(object);

            object.___ref___ = new Proxy(object, {
                deleteProperty: del,
                get: get,
                set: set
            });

            return object.___ref___;
        }
    }, {
        key: 'clearBindings',
        value: function clearBindings(object) {
            object.___wrapped___ = {};
            object.___bindingAll___ = {};
            object.___binding___ = {};
            object.___before___ = {};
            object.___after___ = {};
            object.___ref___ = {};
            object.toString = function () {
                return '{}';
            };
        }
    }]);

    return Bindable;
}();
  })();
});

require.register("curvature/base/Cache.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = exports.Cache = function () {
	function Cache() {
		_classCallCheck(this, Cache);
	}

	_createClass(Cache, null, [{
		key: 'store',
		value: function store(key, value, expiry) {
			var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'standard';

			var expiration = expiry * 1000 + new Date().getTime();

			// console.log(
			// 	`Caching ${key} until ${expiration} in ${bucket}.`
			// 	, value
			// 	, this.bucket
			// );

			if (!this.bucket) {
				this.bucket = {};
			}

			if (!this.bucket[bucket]) {
				this.bucket[bucket] = {};
			}

			this.bucket[bucket][key] = { expiration: expiration, value: value };
		}
	}, {
		key: 'load',
		value: function load(key) {
			var defaultvalue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var bucket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'standard';

			// console.log(
			// 	`Checking cache for ${key} in ${bucket}.`
			// 	, this.bucket
			// );

			if (this.bucket && this.bucket[bucket] && this.bucket[bucket][key]) {
				// console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
				if (this.bucket[bucket][key].expiration > new Date().getTime()) {
					return this.bucket[bucket][key].value;
				}
			}

			return defaultvalue;
		}
	}]);

	return Cache;
}();
  })();
});

require.register("curvature/base/Cookie.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Cookie = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookie = exports.Cookie = function () {
	function Cookie() {
		_classCallCheck(this, Cookie);
	}

	_createClass(Cookie, null, [{
		key: 'set',
		value: function set(name, value) {
			Cookie.jar[name] = value;
		}
	}, {
		key: 'get',
		value: function get(name) {
			return Cookie.jar[name];
		}
	}, {
		key: 'delete',
		value: function _delete(name) {
			delete Cookie.jar[name];
		}
	}]);

	return Cookie;
}();

;

Cookie.jar = Cookie.jar || _Bindable.Bindable.makeBindable({});

if (window.location.href.substr(0, 4) !== 'data') {
	document.cookie.split(';').map(function (c) {
		var _c$split = c.split('='),
		    _c$split2 = _slicedToArray(_c$split, 2),
		    key = _c$split2[0],
		    value = _c$split2[1];

		try {
			value = JSON.parse(value);
		} catch (error) {
			value = value;
		}

		Cookie.jar[decodeURIComponent(key)] = value;
	});

	Cookie.jar.bindTo(function (v, k, t, d) {
		t[k] = v;

		if (d) {
			t[k] = null;
		}

		var cookieString = encodeURIComponent(k) + '=' + JSON.stringify(t[k]);
		document.cookie = cookieString;
	});
}
  })();
});

require.register("curvature/base/Dom.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dom = exports.Dom = function () {
	function Dom() {
		_classCallCheck(this, Dom);
	}

	_createClass(Dom, null, [{
		key: "mapTags",
		value: function mapTags(doc, selector, callback, startNode, endNode) {
			var result = [];

			var started = true;

			if (startNode) {
				started = false;
			}

			var ended = false;

			var treeWalker = document.createTreeWalker(doc, NodeFilter.SHOW_ALL, {
				acceptNode: function acceptNode(node) {
					if (!started) {
						if (node === startNode) {
							started = true;
						} else {
							return NodeFilter.FILTER_SKIP;
						}
					}
					if (endNode && node === endNode) {
						ended = true;
					}
					if (ended) {
						return NodeFilter.FILTER_SKIP;
					}
					if (selector) {
						// console.log(selector, node, !!(node instanceof Element));
						if (node instanceof Element) {
							if (node.matches(selector)) {
								return NodeFilter.FILTER_ACCEPT;
							}
						}

						return NodeFilter.FILTER_SKIP;
					}

					return NodeFilter.FILTER_ACCEPT;
				}
			}, false);

			while (treeWalker.nextNode()) {
				result.push(callback(treeWalker.currentNode));
			}

			return result;
		}
	}, {
		key: "dispatchEvent",
		value: function dispatchEvent(doc, event) {
			doc.dispatchEvent(event);

			Dom.mapTags(doc, false, function (node) {
				node.dispatchEvent(event);
			});
		}
	}]);

	return Dom;
}();
  })();
});

require.register("curvature/base/Repository.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Repository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cookie = require('./Cookie');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objects = {};

var Repository = exports.Repository = function () {
	function Repository() {
		_classCallCheck(this, Repository);
	}

	_createClass(Repository, null, [{
		key: 'loadPage',
		value: function loadPage() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			return this.request(this.uri, args).then(function (response) {
				return response;
				// return response.map((skeleton) => new Model(skeleton));
			});
		}
	}, {
		key: 'domCache',
		value: function domCache(uri, content) {
			console.log(uri, content);
		}
	}, {
		key: 'load',
		value: function load(id) {
			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.objects = this.objects || {};
			this.objects[this.uri] = this.objects[this.uri] || {};

			if (this.objects[this.uri][id]) {
				return Promise.resolve(this.objects[this.uri][id]);
			}

			return this.request(this.uri + '/' + id).then(function (response) {
				// let model = new Model(response);
				// return this.objects[this.uri][id] = model;
			});
		}
	}, {
		key: 'form',
		value: function form() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			var uri = this.uri + '/' + 'create';
			if (id) {
				uri = this.uri + '/' + id + '/edit';
			}
			return this.request(uri).then(function (skeleton) {
				return skeleton;
			});
		}
	}, {
		key: 'clearCache',
		value: function clearCache() {
			if (this.objects && this.objects[this.uri]) {
				this.objects[this.uri] = {};
			}
		}
	}, {
		key: 'request',
		value: function request(uri) {
			var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var _this = this;

			var post = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			var type = 'GET';
			var queryString = '';
			var formData = null;
			var queryArgs = {};

			if (args) {
				queryArgs = args;
			}

			queryArgs.api = queryArgs.api || 'json';

			queryString = Object.keys(queryArgs).map(function (arg) {
				return encodeURIComponent(arg) + '=' + encodeURIComponent(queryArgs[arg]);
			}).join('&');

			var fullUri = uri;
			var postString = '';

			if (post) {
				cache = false;
				type = 'POST';
				formData = new FormData();
				for (var i in post) {
					formData.append(i, post[i]);
				}
				postString = Object.keys(post).map(function (arg) {
					return encodeURIComponent(arg) + '=' + encodeURIComponent(post[arg]);
				}).join('&');
			}

			fullUri = uri + '?' + queryString;

			var xhr = new XMLHttpRequest();

			if (!post && cache && this.cache && this.cache[fullUri]) {
				return Promise.resolve(this.cache[fullUri]);
			}

			var tagCacheSelector = 'script[data-uri="' + fullUri + '"]';

			var tagCache = document.querySelector(tagCacheSelector);

			if (!post && cache && tagCache) {
				var tagCacheContent = JSON.parse(tagCache.innerText);

				return Promise.resolve(tagCacheContent);
			}

			xhr.withCredentials = true;
			xhr.timeout = 15000;

			var xhrId = this.xhrs.length;

			if (!post) {
				this.xhrs.push(xhr);
			}

			return new Promise(function (xhrId) {
				return function (resolve, reject) {
					xhr.onreadystatechange = function () {
						var DONE = 4;
						var OK = 200;

						var response = void 0;

						if (xhr.readyState === DONE) {

							if (!_this.cache) {
								_this.cache = {};
							}

							if (xhr.status === OK) {

								if (response = JSON.parse(xhr.responseText)) {
									if (response.code == 0) {
										// Repository.lastResponse = response;

										if (!post && cache) {
											// this.cache[fullUri] = response;
										}

										var _tagCache = document.querySelector('script[data-uri="' + fullUri + '"]');

										var prerendering = _Cookie.Cookie.get('prerenderer');

										if (prerendering) {
											if (!_tagCache) {
												_tagCache = document.createElement('script');
												document.querySelector('head').appendChild(_tagCache);
											}

											_tagCache.type = 'text/json';
											_tagCache.setAttribute('data-uri', fullUri);
											_tagCache.innerText = JSON.stringify(response);
										}

										resolve(response);
									} else {
										if (!post && cache) {
											// this.cache[fullUri] = response;
										}

										reject(response);
									}
								} else {
									// Repository.lastResponse = xhr.responseText;

									if (!post && cache) {
										// this.cache[fullUri] = xhr.responseText;
									}

									resolve(xhr.responseText);
								}
							} else {
								reject('HTTP' + xhr.status);
							}
							_this.xhrs[xhrId] = null;
						}
					};

					xhr.open(type, fullUri);

					if (post) {
						xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					}
					xhr.send(postString);
				};
			}(xhrId));
		}
	}, {
		key: 'cancel',
		value: function cancel() {
			for (var i in this.xhrs) {
				if (!this.xhrs[i]) {
					continue;
				}
				this.xhrs[i].abort();
			}
			this.xhrList = [];
		}
	}, {
		key: 'xhrs',
		get: function get() {
			return this.xhrList = this.xhrList || [];
		}
	}]);

	return Repository;
}();

// Repository.lastResponse = null;
  })();
});

require.register("curvature/base/Router.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View = require('./View');

var _Cache = require('./Cache');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = exports.Router = function () {
	function Router() {
		_classCallCheck(this, Router);
	}

	_createClass(Router, null, [{
		key: 'listen',
		value: function listen(mainView) {
			var _this = this;

			window.addEventListener('popstate', function (event) {
				event.preventDefault();

				_this.match(location.pathname, mainView);
			});

			this.go(location.pathname);
		}
	}, {
		key: 'go',
		value: function go(route, silent) {
			if (location.pathname !== route) {
				history.pushState(null, null, route);
			}
			if (!silent) {
				window.dispatchEvent(new Event('popstate'));
			}
		}
	}, {
		key: 'match',
		value: function match(path, view) {
			var forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var current = view.args.content;
			var routes = view.routes;

			this.path = path;
			this.query = {};

			var query = new URLSearchParams(window.location.search);

			this.queryString = window.location.search;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = query[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pair = _step.value;

					this.query[pair[0]] = pair[1];
				}

				// forceRefresh = true;
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var result = void 0;

			// if(!forceRefresh && (result = Cache.load(this.path, false, 'page')))
			// {
			// 	// console.log('Using cache!');

			// 	view.args.content.pause(true);

			// 	view.args.content = result;

			// 	result.pause(false);

			// 	result.update(this.query);

			// 	return;
			// }

			path = path.substr(1).split('/');

			var args = {};
			for (var i in this.query) {
				args[i] = this.query[i];
			}

			L1: for (var _i in routes) {
				var route = _i.split('/');
				if (route.length < path.length) {
					continue;
				}

				L2: for (var j in route) {
					if (route[j].substr(0, 1) == '%') {
						var argName = null;
						var groups = /^%(\w+)\??/.exec(route[j]);
						if (groups && groups[1]) {
							argName = groups[1];
						}
						if (!argName) {
							throw new Error(route[j] + ' is not a valid argument segment in route "' + _i + '"');
						}
						if (!path[j]) {
							if (route[j].substr(route[j].length - 1, 1) == '?') {
								args[argName] = '';
							} else {
								continue L1;
							}
						} else {
							args[argName] = path[j];
						}
					} else if (path[j] !== route[j]) {
						continue L1;
					}
				}

				if (typeof routes[_i] !== 'function') {
					return routes[_i];
				}

				if (!forceRefresh && current && current instanceof routes[_i] && current.update(args)) {
					view.args.content = current;

					return true;
				}

				var _result = routes[_i];

				if (routes[_i] instanceof Object) {
					_result = new routes[_i](args);
				}

				if (_result instanceof _View.View) {
					_result.pause(false);
				}

				_result.update(args, forceRefresh);

				if (view.args.content instanceof _View.View) {
					view.args.content.pause(true);
				}

				// Cache.store(this.path, result, 3600, 'page');

				view.args.content = _result;
				return true;
			}

			if (routes && routes[false]) {
				if (!forceRefresh && current && current instanceof routes[false] && current.update(args)) {
					view.args.content = current;

					return false;
				}

				if (typeof routes[false] !== 'function') {
					view.args.content = routes[false];
				}

				var _result2 = routes[false];

				if (_result2 instanceof _View.View) {
					_result2.pause(false);
				}

				if (routes[false] instanceof Object) {
					_result2 = new routes[false](args);
				}

				_result2.update(args, forceRefresh);

				if (view.args.content instanceof _View.View) {
					view.args.content.pause(true);
				}

				view.args.content = _result2;

				_Cache.Cache.store(this.path, _result2, 3600, 'page');
			}

			return false;
		}
	}, {
		key: 'clearCache',
		value: function clearCache() {
			// this.cache = {};
		}
	}, {
		key: 'queryOver',
		value: function queryOver() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var parts = [],
			    finalArgs = {};

			for (var i in this.query) {
				finalArgs[i] = this.query[i];
			}

			for (var _i2 in args) {
				finalArgs[_i2] = args[_i2];
			}

			delete finalArgs['api'];

			return finalArgs;
		}
	}, {
		key: 'queryToString',
		value: function queryToString() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var fresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var parts = [],
			    finalArgs = args;

			if (!fresh) {
				finalArgs = this.queryOver(args);
			}

			for (var i in finalArgs) {
				if (finalArgs[i] === '') {
					continue;
				}
				parts.push(i + '=' + encodeURIComponent(finalArgs[i]));
			}

			return parts.join('&');
		}
	}, {
		key: 'setQuery',
		value: function setQuery(name, value, silent) {
			var args = {};

			args[name] = value;

			this.go(this.path + '?' + this.queryToString(args), silent);
		}
	}]);

	return Router;
}();
  })();
});

require.register("curvature/base/Tag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Tag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = exports.Tag = function () {
	function Tag(element, parent, ref, index) {
		var _this = this;

		_classCallCheck(this, Tag);

		this.element = _Bindable.Bindable.makeBindable(element);
		this.parent = parent;
		this.ref = ref;
		this.index = index;

		this.proxy = _Bindable.Bindable.makeBindable(this);
		this.cleanup = [];

		this.detachListener = function (event) {
			if (event.path[event.path.length - 1] !== window) {
				return;
			}
			_this.remove();
			_this.element.removeEventListener('cvDomDetached', _this.detachListener);
			_this.element = _this.ref = _this.parent = null;
		};

		this.element.addEventListener('cvDomDetached', this.detachListener);

		return this.proxy;
	}

	_createClass(Tag, [{
		key: 'remove',
		value: function remove() {
			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			_Bindable.Bindable.clearBindings(this);

			this.clear();
		}
	}, {
		key: 'clear',
		value: function clear() {
			if (!this.element) {
				return;
			}

			var detachEvent = new Event('cvDomDetached');

			while (this.element.firstChild) {
				this.element.firstChild.dispatchEvent(detachEvent);
				this.element.removeChild(this.element.firstChild);
			}
		}
	}]);

	return Tag;
}();
  })();
});

require.register("curvature/base/View.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.View = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _ViewList = require('./ViewList');

var _Router = require('./Router');

var _Cookie = require('./Cookie');

var _Dom = require('./Dom');

var _Tag = require('./Tag');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = exports.View = function () {
	function View() {
		var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, View);

		this.args = _Bindable.Bindable.makeBindable(args);
		this._id = this.uuid();
		this.args._id = this._id;
		this.template = '';
		this.parent = null;

		this.firstNode = null;
		this.lastNode = null;
		this.nodes = null;

		this.frames = [];
		this.timeouts = [];
		this.intervals = [];

		this.cleanup = [];

		this.attach = [];
		this.detach = [];

		this.eventCleanup = [];

		this.parent = null;
		this.viewList = null;
		this.viewLists = {};

		this.tags = {};

		this.intervals = [];
		this.timeouts = [];
		this.frames = [];
	}

	_createClass(View, [{
		key: 'onFrame',
		value: function onFrame(callback) {
			var c = function c(timestamp) {
				callback(timestamp);
				window.requestAnimationFrame(c);
			};

			c();
		}
	}, {
		key: 'onTimeout',
		value: function onTimeout(time, callback) {
			var _this = this;

			var wrappedCallback = function wrappedCallback() {
				_this.timeouts[index].fired = true;
				_this.timeouts[index].callback = null;
				callback();
			};
			var timeout = setTimeout(wrappedCallback, time);
			var index = this.timeouts.length;

			this.timeouts.push({
				timeout: timeout,
				callback: wrappedCallback,
				time: time,
				fired: false,
				created: new Date().getTime(),
				paused: false
			});

			return timeout;
		}
	}, {
		key: 'clearTimeout',
		value: function clearTimeout(timeout) {
			for (var i in this.timeouts) {
				if (timeout === this.timeouts[i].timeout) {
					clearInterval(this.timeouts[i].timeout);

					delete this.timeouts[i];
				}
			}
		}
	}, {
		key: 'onInterval',
		value: function onInterval(time, callback) {
			var timeout = setInterval(callback, time);

			this.intervals.push({
				timeout: timeout,
				callback: callback,
				time: time,
				paused: false
			});

			return timeout;
		}
	}, {
		key: 'clearInterval',
		value: function (_clearInterval) {
			function clearInterval(_x) {
				return _clearInterval.apply(this, arguments);
			}

			clearInterval.toString = function () {
				return _clearInterval.toString();
			};

			return clearInterval;
		}(function (timeout) {
			for (var i in this.intervals) {
				if (timeout === this.intervals[i].timeout) {
					clearInterval(this.intervals[i].timeout);

					delete this.intervals[i];
				}
			}
		})
	}, {
		key: 'pause',
		value: function pause() {
			var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

			if (paused === undefined) {
				this.paused = !this.paused;
			}

			this.paused = paused;

			if (this.paused) {
				for (var i in this.timeouts) {
					if (this.timeouts[i].fired) {
						delete this.timeouts[i];
						continue;
					}

					clearTimeout(this.timeouts[i].timeout);
				}

				for (var _i in this.intervals) {
					clearInterval(this.intervals[_i].timeout);
				}
			} else {
				for (var _i2 in this.timeouts) {
					if (!this.timeouts[_i2].timeout.paused) {
						continue;
					}

					if (this.timeouts[_i2].fired) {
						delete this.timeouts[_i2];
						continue;
					}

					this.timeouts[_i2].timeout = setTimeout(this.timeouts[_i2].callback, this.timeouts[_i2].time);
				}

				for (var _i3 in this.intervals) {
					if (!this.intervals[_i3].timeout.paused) {
						continue;
					}

					this.intervals[_i3].timeout.paused = false;

					this.intervals[_i3].timeout = setInterval(this.intervals[_i3].callback, this.intervals[_i3].time);
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var insertPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (this.nodes) {
				for (var i in this.detach) {
					this.detach[i]();
				}

				var _loop = function _loop(_i4) {
					var detachEvent = new Event('cvDomDetached', { bubbles: true, target: _this2.nodes[_i4] });
					var attachEvent = new Event('cvDomAttached', { bubbles: true, target: _this2.nodes[_i4] });

					_this2.nodes[_i4].dispatchEvent(detachEvent);

					_Dom.Dom.mapTags(_this2.nodes[_i4], false, function (node) {
						node.dispatchEvent(detachEvent);
					});

					if (parentNode) {
						if (insertPoint) {
							parentNode.insertBefore(_this2.nodes[_i4], insertPoint);
						} else {
							parentNode.appendChild(_this2.nodes[_i4]);
						}
					}

					_Dom.Dom.mapTags(_this2.nodes[_i4], false, function (node) {
						node.dispatchEvent(attachEvent);
					});

					_this2.nodes[_i4].dispatchEvent(attachEvent);
				};

				for (var _i4 in this.nodes) {
					_loop(_i4);
				}

				for (var _i5 in this.attach) {
					this.attach[_i5]();
				}

				return;
			}

			var subDoc = void 0;

			if (this.template == document) {
				subDoc = this.template;
			} else {
				subDoc = document.createRange().createContextualFragment(this.template);
			}

			// Dom.mapTags(subDoc, '[cv-ref]', (tag)=>{
			// 	this.mapRefTags(tag)
			// });

			_Dom.Dom.mapTags(subDoc, false, function (tag) {
				if (tag.matches) {
					_this2.mapInterpolatableTags(tag);

					tag.matches('[cv-each]') && _this2.mapEachTags(tag);

					tag.matches('[cv-with]') && _this2.mapWithTags(tag);

					tag.matches('[cv-prerender]') && _this2.mapPrendererTags(tag);

					tag.matches('[cv-link]') && _this2.mapLinkTags(tag);

					tag.matches('[cv-on]') && _this2.mapOnTags(tag);

					tag.matches('[cv-bind]') && _this2.mapBindTags(tag);

					tag.matches('[cv-ref]') && _this2.mapRefTags(tag);

					tag.matches('[cv-if]') && _this2.mapIfTags(tag);
				} else {
					_this2.mapInterpolatableTags(tag);
				}
			});

			this.nodes = [];

			this.firstNode = document.createComment('Template ' + this._id + ' Start');

			this.nodes.push(this.firstNode);

			if (parentNode) {
				if (insertPoint) {
					parentNode.insertBefore(this.firstNode, insertPoint);
				} else {
					parentNode.appendChild(this.firstNode);
				}
			}

			while (subDoc.firstChild) {
				var newNode = subDoc.firstChild;
				var _attachEvent = new Event('cvDomAttached', { bubbles: true, target: newNode });

				this.nodes.push(subDoc.firstChild);

				if (parentNode) {
					if (insertPoint) {
						parentNode.insertBefore(subDoc.firstChild, insertPoint);
					} else {
						parentNode.appendChild(subDoc.firstChild);
					}
				}

				_Dom.Dom.mapTags(newNode, false, function (node) {
					// node.dispatchEvent(attachEvent);
				});

				newNode.dispatchEvent(_attachEvent);
			}

			this.lastNode = document.createComment('Template ' + this._id + ' End');

			this.nodes.push(this.lastNode);

			if (parentNode) {
				if (insertPoint) {
					parentNode.insertBefore(this.lastNode, insertPoint);
				} else {
					parentNode.appendChild(this.lastNode);
				}
			}

			for (var _i6 in this.attach) {
				this.attach[_i6]();
			}

			this.postRender(parentNode);

			// return this.nodes;
		}
	}, {
		key: 'mapInterpolatableTags',
		value: function mapInterpolatableTags(tag) {
			var _this3 = this;

			var regex = /(\[\[(\$?\w+)\]\])/g;

			if (tag.nodeType == Node.TEXT_NODE) {
				var original = tag.nodeValue;

				if (!this.interpolatable(original)) {
					return;
				}

				var header = 0;
				var match = void 0;

				while (match = regex.exec(original)) {
					var bindProperty = match[2];

					var unsafeHtml = false;

					if (bindProperty.substr(0, 1) === '$') {
						unsafeHtml = true;
						bindProperty = bindProperty.substr(1);
					}

					var staticPrefix = original.substring(header, match.index);

					header = match.index + match[1].length;

					var _staticNode = document.createTextNode(staticPrefix);

					tag.parentNode.insertBefore(_staticNode, tag);

					var dynamicNode = void 0;

					if (unsafeHtml) {
						dynamicNode = document.createElement('div');
					} else {
						dynamicNode = document.createTextNode('');
					}

					tag.parentNode.insertBefore(dynamicNode, tag);

					this.args.bindTo(bindProperty, function (dynamicNode, unsafeHtml) {
						return function (v, k, t) {
							// console.log(`Setting ${k} to ${v}`, dynamicNode);
							if (t[k] instanceof View) {
								t[k].remove();
							}

							dynamicNode.nodeValue = '';

							if (v instanceof View) {

								v.render(tag.parentNode, dynamicNode);
							} else {
								// console.log(dynamicNode);
								if (unsafeHtml) {
									dynamicNode.innerHTML = v;
								} else {
									dynamicNode.nodeValue = v;
								}
							}
						};
					}(dynamicNode, unsafeHtml));
				}

				var staticSuffix = original.substring(header);

				var staticNode = document.createTextNode(staticSuffix);

				tag.parentNode.insertBefore(staticNode, tag);

				tag.nodeValue = '';
			}

			if (tag.nodeType == Node.ELEMENT_NODE) {
				var _loop2 = function _loop2(i) {
					if (!_this3.interpolatable(tag.attributes[i].value)) {
						return 'continue';
					}

					var header = 0;
					var match = void 0;
					var original = tag.attributes[i].value;
					var attribute = tag.attributes[i];

					var bindProperties = {};
					var segments = [];

					while (match = regex.exec(original)) {
						segments.push(original.substring(header, match.index));

						if (!bindProperties[match[2]]) {
							bindProperties[match[2]] = [];
						}

						bindProperties[match[2]].push(segments.length);

						segments.push(match[1]);

						header = match.index + match[1].length;
					}

					segments.push(original.substring(header));

					for (var j in bindProperties) {
						_this3.args.bindTo(j, function (v, k, t, d) {
							for (var _i7 in bindProperties) {
								for (var _j in bindProperties[_i7]) {
									segments[bindProperties[_i7][_j]] = t[_i7];

									if (k === _i7) {
										segments[bindProperties[_i7][_j]] = v;
									}
								}
							}
							tag.setAttribute(attribute.name, segments.join(''));
						});
					}

					// console.log(bindProperties, segments);

					// console.log(tag.attributes[i].name, tag.attributes[i].value);
				};

				for (var i = 0; i < tag.attributes.length; i++) {
					var _ret2 = _loop2(i);

					if (_ret2 === 'continue') continue;
				}
			}
		}
	}, {
		key: 'mapRefTags',
		value: function mapRefTags(tag) {
			var refAttr = tag.getAttribute('cv-ref');

			var _refAttr$split = refAttr.split(':'),
			    _refAttr$split2 = _slicedToArray(_refAttr$split, 3),
			    refProp = _refAttr$split2[0],
			    refClassname = _refAttr$split2[1],
			    refKey = _refAttr$split2[2];

			var refClass = this.stringToClass(refClassname);

			tag.removeAttribute('cv-ref');

			// if(this.viewList)
			// {
			// 	if(!this.viewList.parent.tags[refProp])
			// 	{
			// 		this.viewList.parent.tags[refProp] = [];
			// 	}

			// 	let refKeyVal = this.args[refKey];

			// 	this.viewList.parent.tags[refProp][refKeyVal] = new refClass(
			// 		tag, this, refProp, refKeyVal
			// 	);
			// }
			// else
			// {
			// 	this.tags[refProp] = new refClass(
			// 		tag, this, refProp
			// 	);
			// }

			var parent = this;

			while (parent) {
				if (!parent.parent) {
					parent.tags[refProp] = new refClass(tag, this, refProp);
				}
				parent = parent.parent;
			}
		}
	}, {
		key: 'mapBindTags',
		value: function mapBindTags(tag) {
			var _this4 = this;

			var bindArg = tag.getAttribute('cv-bind');
			this.args.bindTo(bindArg, function (v, k, t) {
				if (t[k] === v) {
					// return;
				}

				if (t[k] instanceof View) {
					t[k].remove();
				}

				if (tag.tagName == 'INPUT' || tag.tagName == 'SELECT') {
					var type = tag.getAttribute('type');
					if (type && type.toLowerCase() == 'checkbox') {
						if (v) {
							tag.checked = true;
						} else {
							tag.checked = false;
						}
					} else if (type !== 'file') {
						tag.value = v || '';
					}
					return;
				}

				if (v instanceof View) {
					v.render(tag);
				} else {
					tag.innerText = v;
				}
			});

			var inputListener = function inputListener(event) {
				if (event.target.getAttribute('type') !== 'password') {
					console.log(event.target.value);
				}

				if (event.target !== tag) {
					return;
				}

				// console.log(event.target.value);

				_this4.args[bindArg] = event.target.value;
			};

			tag.addEventListener('input', inputListener);
			tag.addEventListener('change', inputListener);
			tag.addEventListener('value-changed', inputListener);

			this.cleanup.push(function (tag, eventListener) {
				return function () {
					tag.removeEventListener('input', inputListener);
					tag.removeEventListener('change', inputListener);
					tag.removeEventListener('value-changed', inputListener);
					tag = undefined;
					eventListener = undefined;
				};
			}(tag, inputListener));

			tag.removeAttribute('cv-bind');
		}
	}, {
		key: 'mapOnTags',
		value: function mapOnTags(tag) {
			var _this5 = this;

			var action = String(tag.getAttribute('cv-on')).split(/;/).map(function (a) {
				return a.split(':');
			}).map(function (object, tag) {
				return function (a) {
					var eventName = a[0].replace(/(^[\s\n]+|[\s\n]+$)/, '');
					var callbackName = a[1];
					var argList = [];
					var groups = /(\w+)(?:\(([\w\s,]+)\))?/.exec(callbackName);
					if (groups.length) {
						callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');
						if (groups[2]) {
							argList = groups[2].split(',').map(function (s) {
								return s.trim();
							});
						}
					}

					var eventMethod = void 0;
					var parent = _this5;

					while (parent) {
						if (typeof parent[callbackName] == 'function') {
							eventMethod = function eventMethod() {
								var _parent;

								(_parent = parent)[callbackName].apply(_parent, arguments);
							};
							break;
						}

						if (parent.viewList && parent.viewList.parent) {
							parent = parent.viewList.parent;
						} else if (parent.parent) {
							parent = parent.parent;
						} else {
							break;
						}
					}

					var eventListener = function (object) {
						return function (event) {
							var argRefs = argList.map(function (arg) {
								if (arg === 'event') {
									return event;
								}
								if (arg in object.args) {
									return object.args[arg];
								}
							});
							// console.log(argList, argRefs);
							if (!(typeof eventMethod == 'function')) {
								// console.log(object);
								// console.trace();
								console.log(_this5, parent);
								throw new Error(callbackName + ' is not defined on View object.\n\nTag:\n\n' + tag.outerHTML);
							}
							eventMethod.apply(undefined, _toConsumableArray(argRefs));
						};
					}(object);

					switch (eventName) {
						case '_init':
							eventListener();
							break;

						case '_attach':
							_this5.attach.push(eventListener);
							break;

						case '_detach':
							_this5.detach.push(eventListener);
							break;

						default:
							tag.addEventListener(eventName, eventListener);

							_this5.cleanup.push(function (tag, eventName, eventListener) {
								return function () {
									tag.removeEventListener(eventName, eventListener);
									tag = undefined;
									eventListener = undefined;
								};
							}(tag, eventName, eventListener));
							break;
					}

					return [eventName, callbackName, argList];
				};
			}(this, tag));

			tag.removeAttribute('cv-on');
		}
	}, {
		key: 'mapLinkTags',
		value: function mapLinkTags(tag) {
			var LinkAttr = tag.getAttribute('cv-link');

			tag.setAttribute('href', LinkAttr);

			var linkClick = function linkClick(event) {
				event.preventDefault();

				_Router.Router.go(tag.getAttribute('href'));
			};

			tag.addEventListener('click', linkClick);

			this.cleanup.push(function (tag, eventListener) {
				return function () {
					tag.removeEventListener('click', eventListener);
					tag = undefined;
					eventListener = undefined;
				};
			}(tag, linkClick));

			tag.removeAttribute('cv-link');
		}
	}, {
		key: 'mapPrendererTags',
		value: function mapPrendererTags(tag) {
			var prerenderAttr = tag.getAttribute('cv-prerender');
			var prerendering = _Cookie.Cookie.get('prerenderer');

			if (prerenderAttr == 'never' && prerendering || prerenderAttr == 'only' && !prerendering) {
				tag.parentNode.removeChild(tag);
			}
		}
	}, {
		key: 'mapWithTags',
		value: function mapWithTags(tag) {
			var withAttr = tag.getAttribute('cv-with');
			var carryAttr = tag.getAttribute('cv-carry');
			tag.removeAttribute('cv-with');
			tag.removeAttribute('cv-carry');

			var subTemplate = tag.innerHTML;

			var carryProps = [];

			if (carryAttr) {
				carryProps = carryAttr.split(',').map(function (s) {
					return s.trim();
				});
			}

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var view = new View();

			this.cleanup.push(function (view) {
				return function () {
					view.remove();
				};
			}(view));

			view.template = subTemplate;
			view.parent = this;

			// console.log(carryProps);

			for (var i in carryProps) {
				this.args.bindTo(carryProps[i], function (view) {
					return function (v, k) {
						view.args[k] = v;
					};
				}(view));
			}

			for (var _i8 in this.args[withAttr]) {
				this.args[withAttr].bindTo(_i8, function (view) {
					return function (v, k) {
						view.args[k] = v;
					};
				}(view));
			}

			view.render(tag);
		}
	}, {
		key: 'mapEachTags',
		value: function mapEachTags(tag) {
			var _this6 = this;

			var eachAttr = tag.getAttribute('cv-each');
			var carryAttr = tag.getAttribute('cv-carry');
			tag.removeAttribute('cv-each');
			tag.removeAttribute('cv-carry');

			var subTemplate = tag.innerHTML;

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var carryProps = [];

			if (carryAttr) {
				carryProps = carryAttr.split(',');
			}

			var _eachAttr$split = eachAttr.split(':'),
			    _eachAttr$split2 = _slicedToArray(_eachAttr$split, 3),
			    eachProp = _eachAttr$split2[0],
			    asProp = _eachAttr$split2[1],
			    keyProp = _eachAttr$split2[2];

			// console.log(this, eachProp);

			var viewList = void 0;

			this.args.bindTo(eachProp, function (viewList) {
				return function (v, k, t) {
					if (viewList) {
						viewList.remove();
					}

					viewList = new _ViewList.ViewList(subTemplate, asProp, v, keyProp);

					viewList.parent = _this6;

					viewList.render(tag);

					for (var i in carryProps) {
						_this6.args.bindTo(carryProps[i], function (v, k) {
							viewList.args.subArgs[k] = v;
						});
					}
				};
			}(viewList));

			this.viewLists[eachProp] = viewList;
		}
	}, {
		key: 'mapIfTags',
		value: function mapIfTags(tag) {
			var ifProperty = tag.getAttribute('cv-if');

			var inverted = false;

			if (ifProperty.substr(0, 1) === '!') {
				inverted = true;
				ifProperty = ifProperty.substr(1);
			}

			var subTemplate = tag.innerHTML;

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var ifDoc = document.createRange().createContextualFragment('');

			var view = new View();

			view.args = this.args;

			this.cleanup.push(function (view) {
				return function () {
					view.remove();
				};
			}(view));

			view.template = subTemplate;
			view.parent = this;

			view.render(tag);

			this.args.bindTo(ifProperty, function (tag, ifDoc) {
				return function (v) {
					var detachEvent = new Event('cvDomDetached');
					var attachEvent = new Event('cvDomAttached');

					if (inverted) {
						v = !v;
					}

					if (v) {
						while (ifDoc.firstChild) {
							var moveTag = ifDoc.firstChild;

							tag.prepend(moveTag);

							moveTag.dispatchEvent(attachEvent);

							_Dom.Dom.mapTags(moveTag, false, function (node) {
								node.dispatchEvent(attachEvent);
							});
						}
					} else {
						while (tag.firstChild) {
							var _moveTag = tag.firstChild;

							ifDoc.prepend(_moveTag);

							_moveTag.dispatchEvent(detachEvent);

							_Dom.Dom.mapTags(_moveTag, false, function (node) {
								node.dispatchEvent(detachEvent);
							});
						}
					}
				};
			}(tag, ifDoc));

			tag.removeAttribute('cv-if');
		}
	}, {
		key: 'postRender',
		value: function postRender(parentNode) {}
	}, {
		key: 'interpolatable',
		value: function interpolatable(str) {
			return !!String(str).match(/\[\[\$?\w+\??\]\]/);
		}
	}, {
		key: 'uuid',
		value: function uuid() {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
				return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
			});
		}
	}, {
		key: 'remove',
		value: function remove() {
			var detachEvent = new Event('cvDomDetached');

			for (var i in this.nodes) {
				this.nodes[i].dispatchEvent(detachEvent);
				this.nodes[i].remove();
			}

			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			for (var _i9 in this.viewLists) {
				if (!this.viewLists[_i9]) {
					continue;
				}
				this.viewLists[_i9].remove();
			}

			this.viewLists = [];

			for (var _i10 in this.tags) {
				if (Array.isArray(this.tags[_i10])) {
					for (var j in this.tags[_i10]) {
						this.tags[_i10][j].remove();
					}
					continue;
				}
				this.tags[_i10].remove();
			}

			_Bindable.Bindable.clearBindings(this);
		}
	}, {
		key: 'update',
		value: function update() {}
	}, {
		key: 'beforeUpdate',
		value: function beforeUpdate(args) {}
	}, {
		key: 'afterUpdate',
		value: function afterUpdate(args) {}
	}, {
		key: 'stringToClass',
		value: function stringToClass(refClassname) {
			var refClassSplit = refClassname.split('/');
			var refShortClassname = refClassSplit[refClassSplit.length - 1];
			var refClass = require(refClassname);

			return refClass[refShortClassname];
		}
	}]);

	return View;
}();
  })();
});

require.register("curvature/base/ViewList.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ViewList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _View = require('./View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewList = exports.ViewList = function () {
	function ViewList(template, subProperty, list) {
		var _this = this;

		var keyProperty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, ViewList);

		this.args = _Bindable.Bindable.makeBindable({});
		this.args.value = _Bindable.Bindable.makeBindable(list || {});
		this.args.subArgs = _Bindable.Bindable.makeBindable({});
		this.views = {};
		this.template = template;
		this.subProperty = subProperty;
		this.keyProperty = keyProperty;
		this.tag = null;
		this.paused = false;

		this.args.value.___before___.push(function (t) {
			// console.log(t.___executing___);
			if (t.___executing___ == 'bindTo') {
				return;
			}
			_this.paused = true;
		});

		this.args.value.___after___.push(function (t) {
			if (_this.paused) {
				// console.log(t.___executing___);
				_this.reRender();
			}
			_this.paused = false;
		});

		// console.log(this.args);

		this.args.value.bindTo(function (v, k, t, d) {

			if (_this.paused) {
				return;
			}

			if (d) {
				_this.views[k].remove();

				delete _this.views[k];
				// console.log(`Deleting ${k}`, v, this.views);

				return;
			}

			// console.log(`Setting ${k}`, v, this.views);

			if (!_this.views[k]) {
				var view = new _View.View();

				_this.views[k] = view;

				_this.views[k].template = _this.template;

				_this.views[k].parent = _this.parent;
				_this.views[k].viewList = _this;

				_this.args.subArgs.bindTo(function (v, k, t, d) {
					view.args[k] = v;
				});

				_this.views[k].args[_this.subProperty] = v;

				if (_this.keyProperty) {
					_this.views[k].args[_this.keyProperty] = k;
				}

				t[k] = v;

				_this.reRender();
			}

			_this.views[k].args[_this.subProperty] = v;
		});
	}

	_createClass(ViewList, [{
		key: 'render',
		value: function render(tag) {
			for (var i in this.views) {
				this.views[i].render(tag);
			}

			this.tag = tag;

			// console.log(tag);
		}
	}, {
		key: 'reRender',
		value: function reRender() {
			var _this2 = this;

			// console.log('rerender');
			if (!this.tag) {
				return;
			}

			var views = [];

			for (var i in this.views) {
				views[i] = this.views[i];
			}

			var finalViews = [];

			var _loop = function _loop(_i) {
				var found = false;
				for (var j in views) {
					if (views[j] && _this2.args.value[_i] === views[j].args[_this2.subProperty]) {
						found = true;
						finalViews[_i] = views[j];
						delete views[j];
						break;
					}
				}
				if (!found) {
					var viewArgs = {};
					viewArgs[_this2.subProperty] = _this2.args.value[_i];
					finalViews[_i] = new _View.View(viewArgs);

					finalViews[_i].template = _this2.template;
					finalViews[_i].parent = _this2.parent;
					finalViews[_i].viewList = _this2;

					finalViews[_i].args[_this2.keyProperty] = _i;

					_this2.args.subArgs.bindTo(function (v, k, t, d) {
						finalViews[_i].args[k] = v;
					});
				}
			};

			for (var _i in this.args.value) {
				_loop(_i);
			}

			var appendOnly = true;

			for (var _i2 in this.views) {
				if (this.views[_i2] !== finalViews[_i2]) {
					appendOnly = false;
				}
			}

			if (!appendOnly) {
				while (this.tag.firstChild) {
					this.tag.removeChild(this.tag.firstChild);
				}

				for (var _i3 in finalViews) {
					finalViews[_i3].render(this.tag);
				}
			} else {
				var _i4 = this.views.length || 0;

				while (finalViews[_i4]) {
					finalViews[_i4].render(this.tag);
					_i4++;
				}
			}

			this.views = finalViews;
		}
	}, {
		key: 'remove',
		value: function remove() {
			for (var i in this.views) {
				this.views[i].remove();
			}

			this.views = [];

			while (this.tag.firstChild) {
				this.tag.removeChild(this.tag.firstChild);
			}
		}
	}]);

	return ViewList;
}();
  })();
});

require.register("curvature/form/ButtonField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ButtonField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonField = exports.ButtonField = function (_Field) {
	_inherits(ButtonField, _Field);

	function ButtonField(values, form, parent, key) {
		_classCallCheck(this, ButtonField);

		var _this = _possibleConstructorReturn(this, (ButtonField.__proto__ || Object.getPrototypeOf(ButtonField)).call(this, values, form, parent, key));

		_this.args.title = _this.args.title || _this.args.value;
		_this.template = '\n\t\t\t<label for = "' + _this.args.name + '" cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<input\n\t\t\t\t\tname  = "' + _this.args.name + '"\n\t\t\t\t\ttype  = "' + _this.args.attrs.type + '"\n\t\t\t\t\tvalue = "[[title]]"\n\t\t\t\t\ton    = "click:clicked(event)"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(ButtonField, [{
		key: 'clicked',
		value: function clicked(event) {
			this.form.buttonClick(this.args.name);
		}
	}]);

	return ButtonField;
}(_Field2.Field);
  })();
});

require.register("curvature/form/Field.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Field = undefined;

var _View2 = require('../base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = exports.Field = function (_View) {
	_inherits(Field, _View);

	function Field(values, form, parent, key) {
		_classCallCheck(this, Field);

		var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, values));

		_this.args.title = _this.args.title || '';
		_this.args.value = _this.args.value || '';

		_this.args.valueString = '';

		_this.form = form;
		_this.parent = parent;
		_this.key = key;

		_this.ignore = _this.args.attrs['data-cv-ignore'] || false;

		var setting = null;

		_this.args.bindTo('value', function (v, k) {
			// console.trace();
			// console.log(this.args.name, v, k);

			if (setting == key) {
				return;
			}

			// console.log(this.args.name, v, k);

			_this.args.valueString = JSON.stringify(v || '', null, 4);

			setting = key;

			_this.parent.args.value[key] = v;
			setting = null;
		});

		_this.parent.args.value.bindTo(key, function (v, k) {
			if (setting == k) {
				return;
			}

			setting = k;

			_this.args.value = v;

			setting = null;
		});

		_this.template = '\n\t\t\t<label for = "' + _this.args.name + '" cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title" cv-ref = "title:curvature/base/Tag">[[title]]:</span>\n\t\t\t\t<input\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\ttype    = "' + (_this.args.attrs.type || 'text') + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		//type    = "${this.args.attrs.type||'text'}"
		return _this;
	}

	return Field;
}(_View2.View);
  })();
});

require.register("curvature/form/FieldSet.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FieldSet = undefined;

var _Field2 = require('./Field');

var _Form = require('./Form');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldSet = exports.FieldSet = function (_Field) {
	_inherits(FieldSet, _Field);

	function FieldSet(values, form, parent, key) {
		_classCallCheck(this, FieldSet);

		var _this = _possibleConstructorReturn(this, (FieldSet.__proto__ || Object.getPrototypeOf(FieldSet)).call(this, values, form, parent, key));

		_this.args.value = {};
		_this.args.fields = _Form.Form.renderFields(values.children, _this);
		_this.template = '\n\t\t\t<label for = "' + _this.args.name + '">\n\t\t\t\t<span cv-if = "title">[[title]]:</span>\n\t\t\t\t<fieldset name = "' + _this.args.name + '">\n\t\t\t\t\t<div cv-each = "fields:field">\n\t\t\t\t\t\t<div cv-bind = "field"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</fieldset>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	return FieldSet;
}(_Field2.Field);
  })();
});

require.register("curvature/form/Form.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Form = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

var _Field = require('./Field');

var _FieldSet = require('./FieldSet');

var _SelectField = require('./SelectField');

var _HtmlField = require('./HtmlField');

var _HiddenField = require('./HiddenField');

var _ButtonField = require('./ButtonField');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { Router           } from 'Router';

// import { Repository       } from '../Repository';

// import { FieldSet         } from './FieldSet';

// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';

var Form = exports.Form = function (_View) {
	_inherits(Form, _View);

	function Form(skeleton) {
		_classCallCheck(this, Form);

		var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, {}));

		_this.args.flatValue = _this.args.flatValue || {};
		_this.args.value = _this.args.value || {};

		_this.args.method = skeleton._method || 'GET';

		_this.args.classes = _this.args.classes || [];

		_this.args.bindTo('classes', function (v) {
			_this.args._classes = v.join(' ');
		});

		_this._onSubmit = [];
		_this.action = '';
		_this.template = '\n\t\t\t<form\n\t\t\t\tclass   = "[[_classes]]"\n\t\t\t\tmethod  = "[[method]]"\n\t\t\t\tcv-each = "fields:field"\n\t\t\t\tcv-on   = "submit:submit(event)"\n\t\t\t\tcv-ref  = "formTag:curvature/base/Tag"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t';

		_this.args.fields = Form.renderFields(skeleton, _this);

		_this.args.bindTo('value', function (v) {
			_this.args.valueString = JSON.stringify(v, null, 4);
		});
		return _this;
	}

	_createClass(Form, [{
		key: 'submit',
		value: function submit(event) {
			event.preventDefault();

			this.args.valueString = JSON.stringify(this.args.value, null, 4);

			for (var i in this._onSubmit) {
				this._onSubmit[i](this, event);
			}
		}
	}, {
		key: 'buttonClick',
		value: function buttonClick(event) {
			// console.log(event);
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit(callback) {
			this._onSubmit.push(callback);
		}
	}, {
		key: 'queryString',
		value: function queryString() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var parts = [];

			for (var i in this.args.flatValue) {
				args[i] = args[i] || this.args.flatValue[i];
			}

			for (var _i in args) {
				parts.push(_i + '=' + encodeURIComponent(args[_i]));
			}

			return parts.join('&');
		}
	}, {
		key: 'populate',
		value: function populate(values) {
			// console.log(values);

			for (var i in values) {
				this.args.value[i] = values[i];
			}
		}
	}], [{
		key: 'renderFields',
		value: function renderFields(skeleton) {
			var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var fields = {};

			var _loop = function _loop(i) {
				if (fields[i]) {
					return 'continue';
				}
				if (i.substr(0, 1) == '_') {
					return 'continue';
				}

				var field = null;
				var form = null;
				if (parent instanceof Form) {
					form = parent;
				} else {
					form = parent.form;
				}

				switch (skeleton[i].type) {
					case 'fieldset':
						field = new _FieldSet.FieldSet(skeleton[i], form, parent, i);
						break;
					case 'select':
						field = new _SelectField.SelectField(skeleton[i], form, parent, i);
						break;
					case 'html':
						field = new _HtmlField.HtmlField(skeleton[i], form, parent, i);
						break;
					case 'submit':
					case 'button':
						field = new _ButtonField.ButtonField(skeleton[i], form, parent, i);
						break;
					case 'hidden':
						field = new _HiddenField.HiddenField(skeleton[i], form, parent, i);
						break;
					default:
						field = new _Field.Field(skeleton[i], form, parent, i);
						break;
				}

				fields[i] = field;

				field.args.bindTo('value', function (v, k, t, d) {
					// console.log(t,v);
					if (t.type == 'html' && !t.contentEditable) {
						return;
					}
					form.args.flatValue[field.args.name] = v;
				});
			};

			for (var i in skeleton) {
				var _ret = _loop(i);

				if (_ret === 'continue') continue;
			}
			return fields;
		}
	}]);

	return Form;
}(_View2.View);
  })();
});

require.register("curvature/form/HiddenField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HiddenField = undefined;

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenField = exports.HiddenField = function (_Field) {
	_inherits(HiddenField, _Field);

	function HiddenField(values, form, parent, key) {
		_classCallCheck(this, HiddenField);

		var _this = _possibleConstructorReturn(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label for = "' + _this.args.name + '" style = "display:none" cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<input\n\t\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\t\ttype    = "' + _this.args.attrs.type + '"\n\t\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t<span cv-if = "value">[[[value]]]</span>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	return HiddenField;
}(_Field2.Field);
  })();
});

require.register("curvature/form/HtmlField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HtmlField = undefined;

var _View2 = require('../base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlField = exports.HtmlField = function (_View) {
	_inherits(HtmlField, _View);

	function HtmlField(values, form, parent, key) {
		_classCallCheck(this, HtmlField);

		var _this = _possibleConstructorReturn(this, (HtmlField.__proto__ || Object.getPrototypeOf(HtmlField)).call(this, values, form, parent, key));

		_this.ignore = _this.args.attrs['data-cv-ignore'] || false;
		_this.args.contentEditable = _this.args.attrs.contenteditable || false;
		_this.template = '<div contenteditable = "[[contentEditable]]">[[$value]]</div>';
		return _this;
	}

	return HtmlField;
}(_View2.View);
  })();
});

require.register("curvature/form/SelectField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SelectField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectField = exports.SelectField = function (_Field) {
	_inherits(SelectField, _Field);

	function SelectField(values, form, parent, key) {
		_classCallCheck(this, SelectField);

		var _this = _possibleConstructorReturn(this, (SelectField.__proto__ || Object.getPrototypeOf(SelectField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label for = "' + _this.args.name + '" cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title" cv-ref = "title:curvature/base/Tag">[[title]]:</span>\n\t\t\t\t<select\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-each = "options:option:optionText"\n\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t\t<option value = "[[option]]">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(SelectField, [{
		key: 'getLabel',
		value: function getLabel() {
			for (var i in this.args.options) {
				if (this.args.options[i] == this.args.value) {
					return i;
				}
			}
		}
	}]);

	return SelectField;
}(_Field2.Field);
  })();
});

require.register("curvature/toast/Toast.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Toast = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

var _ToastAlert = require('./ToastAlert');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toast = exports.Toast = function (_View) {
	_inherits(Toast, _View);

	_createClass(Toast, null, [{
		key: 'instance',
		value: function instance() {
			if (!this.inst) {
				this.inst = new this();
			}
			return this.inst;
		}
	}]);

	function Toast() {
		_classCallCheck(this, Toast);

		var _this = _possibleConstructorReturn(this, (Toast.__proto__ || Object.getPrototypeOf(Toast)).call(this));

		_this.template = '\n\t\t\t<div id = "[[_id]]" cv-each = "alerts:alert" class = "toast">\n\t\t\t\t[[alert]]\n\t\t\t</div>\n\t\t';
		// this.style = {
		// 	'': {
		// 		position:   'fixed'
		// 		, top:      '0px'
		// 		, right:    '0px'
		// 		, padding:  '8px'
		// 		, 'z-index':'999999'
		// 		, display:  'flex'
		// 		, 'flex-direction': 'column-reverse'
		// 	}
		// };

		_this.args.alerts = [];

		_this.args.alerts.bindTo(function (v) {
			console.log(v);
		});
		return _this;
	}

	_createClass(Toast, [{
		key: 'pop',
		value: function pop(alert) {
			var _this2 = this;

			var index = this.args.alerts.length;

			this.args.alerts.push(alert);

			alert.decay(function (alert) {
				return function () {
					for (var i in _this2.args.alerts) {
						if (_this2.args.alerts) {
							_this2.args.alerts[i] === alert;

							_this2.args.alerts.splice(i, 1);
							return;
						}
					}
				};
			}(alert));
		}
	}]);

	return Toast;
}(_View2.View);
  })();
});

require.register("curvature/toast/ToastAlert.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ToastAlert = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToastAlert = exports.ToastAlert = function (_View) {
	_inherits(ToastAlert, _View);

	function ToastAlert(args) {
		_classCallCheck(this, ToastAlert);

		var _this = _possibleConstructorReturn(this, (ToastAlert.__proto__ || Object.getPrototypeOf(ToastAlert)).call(this, args));

		_this.args.time = _this.args.time || 10000;
		_this.init = _this.args.time;
		_this.args.opacity = 1;
		_this.args.title = _this.args.title || 'Standard alert';
		_this.args.body = _this.args.body || 'This is a standard alert.';
		_this.template = '\n\t\t\t<div id = "[[_id]]" style = "opacity:[[opacity]]" class = "alert">\n\t\t\t\t<h3>[[title]]</h3>\n\t\t\t\t<p>[[body]]</p>\n\t\t\t</div>\n\t\t';
		return _this;
	}

	_createClass(ToastAlert, [{
		key: 'decay',
		value: function decay(complete) {
			var _this2 = this;

			var decayInterval = 16;
			var decay = setInterval(function () {
				if (_this2.args.time > 0) {
					_this2.args.time -= decayInterval;
					_this2.args.opacity = _this2.args.time / _this2.init;

					if (_this2.args.time <= 0) {
						if (complete) {
							complete();
						}
						clearInterval(decay);
					}
				}
			}, decayInterval);
		}
	}]);

	return ToastAlert;
}(_View2.View);
  })();
});
require.register("Access/Profile.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Profile = undefined;

var _Config = require('Config');

var _Repository = require('curvature/base/Repository');

var _UserRepository = require('curvature/access/UserRepository');

var _View2 = require('curvature/base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Profile = exports.Profile = function (_View) {
	_inherits(Profile, _View);

	function Profile(args) {
		_classCallCheck(this, Profile);

		var _this = _possibleConstructorReturn(this, (Profile.__proto__ || Object.getPrototypeOf(Profile)).call(this, args));

		_this.template = require('./ProfileTemplate.html');

		_this.args.user = {
			id: 0,
			username: '',
			publicId: ''

		};

		_UserRepository.UserRepository.getCurrentUser(1).then(function (resp) {
			Object.keys(resp.body).map(function (k) {
				_this.args.user[k] = resp.body[k];
			});
		});
		return _this;
	}

	return Profile;
}(_View2.View);

});

require.register("Board/Board.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Board = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Repository = require('curvature/base/Repository');

var _View2 = require('curvature/base/View');

var _Row = require('./Row');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Board = function (_View) {
	_inherits(Board, _View);

	function Board(args) {
		_classCallCheck(this, Board);

		var _this = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, args));

		var size = 9;

		_this.moving = false;
		_this.args.rows = [];
		_this.lastMove = -1;
		_this.args.currentPlayer = false;
		_this.args.over = false;
		_this.args.full = true;
		_this.args.move = 0;

		_this.playerNames = ['Red', 'Blue', 'Green'];

		_this.refresh(function (resp) {
			_this.args.height = resp.body.boardData.height;
			_this.args.width = resp.body.boardData.width;

			if (_this.args.height) {
				for (var i = 0; i < _this.args.height; i++) {
					_this.args.rows.push(new _Row.Row({
						board: _this,
						width: _this.args.width,
						y: i
					}));
				}
			}

			_this.onTimeout(1, function () {
				_this.updateBoard(resp);

				document.dispatchEvent(new Event('renderComplete'));
			});
		});

		_this.template = require('./BoardTemplate.html');

		_this.onInterval(1000, function () {
			_this.refresh(function (resp) {
				return _this.updateBoard(resp);
			});
		});
		return _this;
	}

	_createClass(Board, [{
		key: 'updateBoard',
		value: function updateBoard(resp) {
			var body = resp.body;

			for (var x = 0; x < this.args.width; x++) {
				for (var y = 0; y < this.args.height; y++) {
					var cell = this.cell(x, y);
					if (cell) {
						cell.args.value = body.boardData.data[x][y].mass;
						cell.args.owner = body.boardData.data[x][y].claimed;
					}
				}
			}

			if (this.lastMove < body.moves && body.chain && body.chain.length > 1) {
				this.chain(body.chain);
				this.lastMove = body.moves;
			}

			if (body.chain.length >= 1) {
				this.cell(body.chain[0][0], body.chain[0][1]).args.lit = true;
			}

			this.args.currentPlayer = this.playerNames[body.currentPlayer];

			this.args.scores = this.args.scores || [];

			for (var i in body.scores) {
				this.args.scores[i] = this.args.scores[i];
			}

			this.args.over = false;

			if (body.moves >= body.maxMoves * body.maxPlayers) {
				this.args.over = true;
			}

			this.args.move = parseInt(body.moves / body.maxPlayers);
			this.args.maxMoves = body.maxMoves;

			if (body.players.length < body.maxPlayers) {
				this.args.full = false;
			} else {
				this.args.full = true;
			}
		}
	}, {
		key: 'cell',
		value: function cell(x, y) {
			if (this.args.rows[y]) {
				return this.args.rows[y].cell(x);
			}

			return false;
		}
	}, {
		key: 'chain',
		value: function chain(_chain) {
			var _this2 = this;

			var _loop = function _loop(i) {
				var x = _chain[i][0];
				var y = _chain[i][1];
				var t = 0;
				if (_chain[i][2]) {
					t = _chain[i][2];
				}
				var cell = _this2.cell(x, y);

				_this2.onTimeout(t * 200, function () {
					cell.args.exploding = true;
				});
			};

			for (var i in _chain) {
				_loop(i);
			}
		}
	}, {
		key: 'setMoving',
		value: function setMoving(moving) {
			this.moving = moving;
		}
	}, {
		key: 'refresh',
		value: function refresh(callback) {
			_Repository.Repository.request(_Config.Config.backend + '/games/' + this.args.gameId, { _t: new Date().getTime() }).then(callback);
		}
	}, {
		key: 'join',
		value: function join() {
			_Repository.Repository.request(_Config.Config.backend + '/games/' + this.args.gameId + '/join', { _t: new Date().getTime() }).then(function () {});
		}
	}]);

	return Board;
}(_View2.View);

exports.Board = Board;

});

require.register("Board/Cell.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Cell = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Repository = require('curvature/base/Repository');

var _Toast = require('curvature/toast/Toast');

var _ToastAlert = require('curvature/toast/ToastAlert');

var _View2 = require('curvature/base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cell = exports.Cell = function (_View) {
	_inherits(Cell, _View);

	function Cell(args) {
		_classCallCheck(this, Cell);

		var _this = _possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).call(this, args));

		_this.template = require('./CellTemplate.html');
		_this.delay = 350;
		_this.delayDrift = 100;
		_this.max = 3;
		_this.icons = {
			neutral: '●'
			// , minus: '-'
			// , plus:  '+'
			// , neutral: '○'
			, minus: '○',
			plus: '●'
		};

		_this.args.value = 0;
		_this.args.displayValue = '';
		_this.args.exploding = false;
		_this.args.lit = false;
		_this.args.owner = null;

		_this.args.bindTo('value', function (v) {
			var icon = _this.icons.neutral;

			if (_this.args.exploding) {
				v = 4;
			}

			icon = _this.icons.plus;

			if (v < 0) {
				icon = _this.icons.minus;

				v *= -1;
			}

			_this.args.displayValue = icon.repeat(v);
		});

		_this.args.bindTo('lit', function (v) {
			if (!v) {
				return;
			}
			setTimeout(function () {
				_this.args.lit = false;
			}, 350);
		});

		_this.args.bindTo('exploding', function (v) {
			if (!v) {
				return;
			}
			setTimeout(function () {
				_this.args.exploding = false;
			}, 350);
		});
		return _this;
	}

	_createClass(Cell, [{
		key: 'drawIcons',
		value: function drawIcons(number) {
			var icon = this.icons.plus;

			if (number < 0) {
				icon = this.icons.minus;

				number *= -1;
			}

			if (!Number.isNumber(number)) {
				return;
			}

			this.args.displayValue = icon.repeat(number);
		}

		// increment(step = 0)
		// {
		// 	if(step === 0)
		// 	{
		// 		this.args.board.setMoving(true);
		// 	}

		// 	this.args.value++;

		// 	let v    = this.args.value;

		// 	let left  = this.args.board.cell(this.args.x - 1, this.args.y);
		// 	let right = this.args.board.cell(this.args.x + 1, this.args.y);
		// 	let above = this.args.board.cell(this.args.x, this.args.y - 1);
		// 	let below = this.args.board.cell(this.args.x, this.args.y + 1);

		// 	if(v > this.max)
		// 	{
		// 		this.args.exploding = true;

		// 		v = 0;
		// 		this.args.value = 0;

		// 		setTimeout(
		// 			()=>{
		// 				this.args.exploding = false;

		// 				left  &&  left.increment(step+1);
		// 				below && below.increment(step+1);
		// 				above && above.increment(step+1);
		// 				right && right.increment(step+1);					
		// 			}
		// 			, this.delay
		// 		);
		// 	}
		// }

	}, {
		key: 'click',
		value: function click() {
			this.sendMove();
		}
	}, {
		key: 'sendMove',
		value: function sendMove() {
			_Repository.Repository.request(_Config.Config.backend + '/games/' + this.args.board.args.gameId + '/move', {
				x: this.args.x,
				y: this.args.y,
				_t: new Date().getTime()
			}).then(function (resp) {
				if (resp.messages.length) {
					for (var i in resp.messages) {
						_Toast.Toast.instance().pop(new _ToastAlert.ToastAlert({
							title: resp.code == 0 ? 'Success!' : 'Error!',
							body: resp.messages[i],
							time: 2400
						}));
					}
				}
			});
		}
	}]);

	return Cell;
}(_View2.View);

});

require.register("Board/Row.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Row = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('curvature/base/View');

var _Cell = require('./Cell');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Row = exports.Row = function (_View) {
	_inherits(Row, _View);

	function Row(args) {
		_classCallCheck(this, Row);

		var _this = _possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).call(this, args));

		_this.args.cells = [];

		if (_this.args.width) {
			for (var i = 0; i < _this.args.width; i++) {
				_this.args.cells.push(new _Cell.Cell({
					board: _this.args.board,
					x: i,
					y: _this.args.y
				}));
			}
		}

		_this.template = require('./RowTemplate.html');
		return _this;
	}

	_createClass(Row, [{
		key: 'cell',
		value: function cell(x) {
			if (this.args.cells[x]) {
				return this.args.cells[x];
			}

			return false;
		}
	}]);

	return Row;
}(_View2.View);

});

require.register("Config.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = exports.Config = function Config() {
  _classCallCheck(this, Config);
};

// Config.backend = '//api.isotope.local.seanmorr.is';


Config.backend = '//isotope-backend:9997';

});

require.register("Form/BaseForm.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BaseForm = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Repository = require('curvature/base/Repository');

var _Form = require('curvature/form/Form');

var _Toast = require('curvature/toast/Toast');

var _ToastAlert = require('curvature/toast/ToastAlert');

var _View2 = require('curvature/base/View');

var _Router = require('curvature/base/Router');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseForm = exports.BaseForm = function (_View) {
	_inherits(BaseForm, _View);

	function BaseForm(args, path) {
		var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

		_classCallCheck(this, BaseForm);

		var _this = _possibleConstructorReturn(this, (BaseForm.__proto__ || Object.getPrototypeOf(BaseForm)).call(this, args));

		_this.args.method = method;
		_this.args.form = null;
		_this.args.title = null;
		_this.template = '\n\t\t\t<div class = "board-wrap">\n\t\t\t\t<div class = "lobby-welcome">\n\t\t\t\t\t<div cv-if = "title"><label>[[title]]</label></div>\n\t\t\t\t\t[[form]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t';

		_Repository.Repository.request(_Config.Config.backend + path, { _t: new Date().getTime() }).then(function (resp) {
			if (!resp || !resp.meta || !resp.meta.form || !(resp.meta.form instanceof Object)) {
				document.dispatchEvent(new Event('renderComplete'));

				console.log('Cannot render form with ', resp);
				_Router.Router.go('/');
				return;
			}

			_this.args.form = new _Form.Form(resp.meta.form);

			document.dispatchEvent(new Event('renderComplete'));

			_this.args.form.onSubmit(function (form, event) {
				var formElement = form.tags.formTag.element;
				var uri = formElement.getAttribute('action') || path;
				var method = formElement.getAttribute('method') || _this.args.method;
				var query = form.args.flatValue;

				method = method.toUpperCase();

				if (method == 'GET') {
					var _query = {};

					if (_this.args.content && _this.args.content.args) {
						_this.args.content.args.page = 0;
					}

					_query.page = 0;

					for (var i in query) {
						if (i === 'api') {
							continue;
						}
						_query[i] = query[i];
					}

					_Router.Router.go(uri + '?' + _Router.Router.queryToString(_query));

					_this.update(_query);
				} else if (method == 'POST') {
					query = form.args.flatValue;

					console.log(uri);

					_Repository.Repository.request(_Config.Config.backend + uri, { api: 'json' }, query).then(function (response) {
						_this.onResponse(response);
					});

					console.log(query);
				}
			});
		});
		return _this;
	}

	_createClass(BaseForm, [{
		key: 'onResponse',
		value: function onResponse(response) {
			if (response.messages) {
				for (var i in response.messages) {
					_Toast.Toast.instance().pop(new _ToastAlert.ToastAlert({
						title: response.body && response.body.id ? 'Success!' : 'Error!',
						body: response.messages[i],
						time: 2400
					}));
				}
			}
		}
	}]);

	return BaseForm;
}(_View2.View);

});

require.register("Form/Create.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Create = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Router = require('curvature/base/Router');

var _BaseForm2 = require('./BaseForm');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Create = exports.Create = function (_BaseForm) {
	_inherits(Create, _BaseForm);

	function Create(args) {
		var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/games/create';

		_classCallCheck(this, Create);

		var _this = _possibleConstructorReturn(this, (Create.__proto__ || Object.getPrototypeOf(Create)).call(this, args, path));

		_this.args.title = 'Create Game';
		return _this;
	}

	_createClass(Create, [{
		key: 'onResponse',
		value: function onResponse(response) {
			_get(Create.prototype.__proto__ || Object.getPrototypeOf(Create.prototype), 'onResponse', this).call(this, response);

			if (response.body && response.body.id) {
				_Router.Router.go('/game/' + response.body.publicId);
			}
		}
	}]);

	return Create;
}(_BaseForm2.BaseForm);

});

require.register("Form/Login.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Login = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Config = require('Config');

var _Router = require('curvature/base/Router');

var _Repository = require('curvature/base/Repository');

var _BaseForm2 = require('./BaseForm');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = exports.Login = function (_BaseForm) {
	_inherits(Login, _BaseForm);

	function Login(args) {
		var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/user/login';

		_classCallCheck(this, Login);

		var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, args, path));

		_this.args.title = 'Login';

		// Repository.request(
		// 	Config.backend + path
		// 	, {api: 'json'}
		// ).then((response)=>{
		// 	this.onResponse(response);
		// });
		return _this;
	}

	_createClass(Login, [{
		key: 'onResponse',
		value: function onResponse(response) {
			_get(Login.prototype.__proto__ || Object.getPrototypeOf(Login.prototype), 'onResponse', this).call(this, response);

			if (response.body && response.body.id) {
				console.log(response.body.id);
				_Router.Router.go('/');
			}
		}
	}]);

	return Login;
}(_BaseForm2.BaseForm);

});

require.register("Form/Register.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Register = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Config = require('Config');

var _Router = require('curvature/base/Router');

var _Repository = require('curvature/base/Repository');

var _BaseForm2 = require('./BaseForm');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Register = exports.Register = function (_BaseForm) {
	_inherits(Register, _BaseForm);

	function Register(args) {
		var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/user/register';

		_classCallCheck(this, Register);

		var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this, args, path));

		_this.args.title = 'Create an Account';

		// Repository.request(
		// 	Config.backend + path
		// 	, {api: 'json'}
		// ).then((response)=>{
		// 	this.onResponse(response);
		// });
		return _this;
	}

	_createClass(Register, [{
		key: 'onResponse',
		value: function onResponse(response) {
			_get(Register.prototype.__proto__ || Object.getPrototypeOf(Register.prototype), 'onResponse', this).call(this, response);

			if (response.body && response.body.id) {
				_Router.Router.go('/');
			}
		}
	}]);

	return Register;
}(_BaseForm2.BaseForm);

});

require.register("Lobby/Lobby.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Lobby = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Cookie = require('curvature/base/Cookie');

var _Repository = require('curvature/base/Repository');

var _UserRepository = require('curvature/access/UserRepository');

var _View2 = require('curvature/base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Lobby = exports.Lobby = function (_View) {
	_inherits(Lobby, _View);

	function Lobby(args) {
		_classCallCheck(this, Lobby);

		var _this = _possibleConstructorReturn(this, (Lobby.__proto__ || Object.getPrototypeOf(Lobby)).call(this, args));

		_this.args.elipses = '...';
		_this.template = require('./LobbyTemplate.html');

		_this.args.games = 0;
		_this.args.gamesFound = 0;
		_this.args.searching = false;

		_this.args.currentUserId = null;

		_this.args.bindTo('games', function (v) {
			if (!v) {
				console.log(v);
				return;
			}
			_this.args.gamesFound = v.length;
		});

		_this.onInterval(150, function () {
			_this.incrementElipses();
		});

		if (!_Cookie.Cookie.get('prerenderer')) {
			_UserRepository.UserRepository.getCurrentUser(1).then(function (resp) {
				_this.args.currentUserId = resp.body.publicId;
			});
		}

		_this.findGame().then(function () {
			document.dispatchEvent(new Event('renderComplete'));
		});
		return _this;
	}

	_createClass(Lobby, [{
		key: 'incrementElipses',
		value: function incrementElipses() {
			if (this.args.elipses.length >= 3) {
				this.args.elipses = '';
			} else {
				this.args.elipses += '.';
			}
		}
	}, {
		key: 'findGame',
		value: function findGame() {
			var _this2 = this;

			var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			event && event.preventDefault();
			this.args.searching = true;

			var args = event ? { t: Date.now() } : null;

			return _Repository.Repository.request(_Config.Config.backend + '/games', args).then(function (resp) {
				_this2.args.games = resp.body;
				_this2.args.searching = false;
			});
		}
	}, {
		key: 'logout',
		value: function logout(event) {
			event.preventDefault();
			_UserRepository.UserRepository.logout();
			this.findGame();
			this.args.currentUserId = null;
		}
	}]);

	return Lobby;
}(_View2.View);

});

require.register("RootView.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RootView = undefined;

var _View2 = require('curvature/base/View');

var _Toast = require('curvature/toast/Toast');

var _Login = require('./Form/Login');

var _Create = require('./Form/Create');

var _Register = require('./Form/Register');

var _Profile = require('./Access/Profile');

var _Lobby = require('./Lobby/Lobby');

var _Board = require('./Board/Board');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RootView = exports.RootView = function (_View) {
	_inherits(RootView, _View);

	function RootView() {
		var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, RootView);

		var _this = _possibleConstructorReturn(this, (RootView.__proto__ || Object.getPrototypeOf(RootView)).call(this, args));

		_this.args.toast = _Toast.Toast.instance();

		_this.routes = {
			'': _Lobby.Lobby,
			home: _Lobby.Lobby,
			game: _Board.Board,
			'game/%gameId': _Board.Board,
			login: _Login.Login,
			register: _Register.Register,
			'my-account': _Profile.Profile,
			create: _Create.Create,
			false: '404!'
		};

		_this.template = '\n\t\t\t[[toast]]\n\t\t\t<div\n\t\t\t\tclass = "main-box"\n\t\t\t\tstyle = "\n\t\t\t\t\twidth: 100%;\n\t\t\t\t\tmax-width: 900px;\n\t\t\t\t\tmargin: auto;\n\t\t\t\t\tposition: relative;"\n\t\t\t>\n\t\t\t\t[[content]]\n\t\t\t</div>\n\t\t';

		return _this;
	}

	return RootView;
}(_View2.View);

});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _Tag = require('curvature/base/Tag');

var _Router = require('curvature/base/Router');

var _RootView = require('./RootView');

document.addEventListener('DOMContentLoaded', function () {
	var view = new _RootView.RootView();
	var body = new _Tag.Tag(document.querySelector('body'));
	body.clear();
	view.render(body.element);
	_Router.Router.listen(view);
});

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

