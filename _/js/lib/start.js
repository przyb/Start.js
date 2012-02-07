(function(root, $, History, _, _str, undefined){
	_.mixin(_.str.exports());
	
	var Start = {};
	
	Start.Tools = {
		// inspired on plugin found in HTML5 Boilerplate, which I kindly appreciate ;)
		log: function() {
			if(root.console) {
				arguments.callee = arguments.callee.caller;
				root.console.log(Array.prototype.slice.call(arguments));
			}
		},
		
		_xhrContext: {},
		
		safeAJAX: function(xhr, context) {
			if (context === undefined) {
				context = '__DEFAULT__';
			}
			
			if (this._xhrContext[context] && this._xhrContext[context].readyState != 4) {
				this._xhrContext[context].abort();
			}
			
			this._xhrContext[context] = xhr;
			
			return xhr;
		}
	};
	
	Start.Lib = {};
	
	/**
	 * Basic controller
	 */
	Start.Lib.Controller = Class.extend({
		getRequest: function() {
			return this._context.getRequest();
		},
		
		getParam: function(name, defaultValue) {
			return this._getRequest().getParam(name, defaultValue);
		},
		
		invoke: function(module, controller, action, params, changeState) {
			this._context.invoke(module, controller, action, params, changeState);
		},
		
		invokeUrl: function(url, changeState) {
			this._context.invokeUrl(url, changeState);
		},
		
		setContext: function(context) {
			this._context = context;
		},
		
		onStart: function() {
			
		},
		
		onEnterContext: function() {
			
		},
		
		onLeaveContext: function() {
			
		}
	});
	
	/**
	 * Request object
	 */
	Start.Lib.Request = Class.extend({
		init: function(route, routeRaw, params, paramsRaw, isInitial) {
			this._route		= _.isString(route) ? route : '';
			this._routeRaw	= _.isString(routeRaw) ? routeRaw : '';
			this._params	= _.isObject(params) ? params : {};
			this._paramsRaw	= _.isString(paramsRaw) ? paramsRaw : '';
			this._isInitial	= _.isBoolean(isInitial) ? isInitial : false;
		},
		
		getIsInitial: function() {
			return this._isInitial;
		},
		
		setIsInitial: function(isInitial) {
			this._isInitial = isInitial;
			return this;
		},
	
		getRoute: function() {
			return this._route;
		},
		
		setRoute: function(route) {
			this._route = route;
			this;
		},
	
		getRouteRaw: function() {
			return this._routeRaw;
		},
		
		setRouteRaw: function(routeRaw) {
			this._routeRaw = routeRaw;
			return this;
		},
	
		getParams: function() {
			return this._params;
		},
		
		setParams: function(params) {
			this._params = params;
			return this;
		},
	
		getParamsRaw: function() {
			return this._paramsRaw;
		},
		
		setParamsRaw: function(paramsRaw) {
			this._paramsRaw = paramsRaw;
			return this;
		},
		
		getParam: function(name, defaultValue) {
			if (this._params[name] === undefined) {
				return defaultValue;
			}
			
			return this._params[name];
		}
	});
	
	/**
	 * Router object
	 */
	Start.Lib.Router = {};
	
	Start.Lib.Router.Abstract = Class.extend({
		parse: undefined,
		assemble: undefined
	});
	
	Start.Lib.Router.Simple = Start.Lib.Router.Abstract.extend({
		parse: function(route) {
			var result = {
				route		: route,
				routeRaw	: route,
				params		: {
					module		: 'index',
					controller	: 'index',
					action		: 'index'
				},
				paramsRaw	: ''
			};
			
			if (route.indexOf('?') >= 0) {
				route = route.split('?');
				route = route[route.length-1];
				route = route.split('&');
				
				var tkn,i;
				for(i in route) {
					tkn = route[i].split('=');
					result.params[tkn[0]] = tkn[1];
				}
			}
			
			return new Start.Lib.Request(result.route, result.routeRaw, result.params, result.paramsRaw);
		},
		
		assemble: function(params) {
			var result = '', i;
			if (_.isObject(params)) {
				for (i in params) {
					if (!result.length) {
						result += '?';
					} else {
						result += '&';
					}
					result += i+'='+params[i];
				}
			}
			
			return result;
		}
	});
	
	Start.Lib.Router.Rewrite = Start.Lib.Router.Abstract.extend({
		parse: function(route) {
			var result = {
				route		: route,
				routeRaw	: route,
				params		: {
					module		: 'index',
					controller	: 'index',
					action		: 'index'
				},
				paramsRaw	: ''
			};

			if (route.indexOf('.html')>=0) {
				var tmp = route.split('/'),
					params = tmp[tmp.length-1];

				result.paramsRaw = params;
				params = params.replace('.html', '').split(',');

				for (var i=0; i<params.length-3; i+=2) {
					if (params[i+1] !== undefined) {
						result.params[params[i]] = params[i+1];
					}
				}

				result.params.controller = params[params.length-2];
				result.params.action = params[params.length-1];
				result.params.module = route;

				result.route = result.route.replace(params, '');
			}
			
			return new Start.Lib.Request(result.route, result.routeRaw, result.params, result.paramsRaw);
		},
		
		assemble: function(params) {
			var route		= _.isString(params.module) ? '/'+_.str.trim(params.module, '/')+'/' : '/',
				result		= route,
				controller	= _.isString(params.controller) ? params.controller : '',
				action		= _.isString(params.action) ? params.action : '',
				ctr			= 0,
				i;
				
			params.module = undefined;
			params.controller = undefined;
			params.action = undefined;
			
			for (i in params) {
				if (_.isString(params[i])) {
					if (ctr++) {
						result += ',';
					}
					result += i+','+params[i];
				}
			}
			result += '.html';
			
			if (!ctr) {
				result = route;
			}
			
			return result;
		}
	});
	
	/**
	 * Bootstrap
	 */
	
	Start.Lib.Bootstrap = Class.extend({
		_modules: {},
		_controllerInstances: {},
		_currentController: undefined,
		
		init: function() {
			if (_.isFunction(this.setup)) {
				this.setup($, History, _, _str);
			}
			
			if (!this.getRouter() instanceof Start.Lib.Router.Abstract) {
				this.setRouter(new Start.Lib.Router.Simple);
			}
			
			this.run(History.getState().hash.replace('://', ''), true);
			
			$(window).bind('statechange', _.bind(function(e) {
				this.run(History.getState().hash.replace('://', ''), false);
			}, this));
		},
		
		setup: function() {},
		
		setRequest: function(request) {
			if (request instanceof Start.Lib.Request) {
				this._request = request;
			}
			
			return this;
		},
		
		getRequest: function() {
			return this._request;
		},
		
		setRouter: function(router) {
			if (router instanceof Start.Lib.Router.Abstract) {
				this._router = router;
			}
			
			return this;
		},
		
		getRouter: function() {
			return this._router;
		},
		
		addController: function(modules, controller, obj) {
			var i;
			if (_.isString(modules)) {
				modules = [
					modules
				];
			}
			
			if (!_.isObject(obj)) {
				obj = {};
			}
			
			var controllerClass = Start.Lib.Controller.extend(obj);
			for (i in modules) {
				if (this._modules[modules[i]] === undefined) {
					this._modules[modules[i]] = {};
				}
				
				this._modules[modules[i]][controller] = controllerClass;
			}
			
			Start.Tools.log('added:', this._modules[modules[i]]);
			
			return this;
		},
		
		run: function(routeRaw, isInitial) {
			isInitial = _.isBoolean(isInitial) ? isInitial : false;
			this.setRequest(
				this.getRouter().parse(
					routeRaw
				).setIsInitial(isInitial));
			
			this.control();
			
			return this;
		},
		
		invoke: function(module, controller, action, params, changeState) {
			if (!_.isObject(params)) {
				params = {};
			}
			params.module = module;
			params.controller = controller;
			params.action = action;
			
			return this.invokeUrl(
				this.getRouter().assemble(params),
				changeState
				);
		},
		
		invokeUrl: function(url, changeState) {
			if (changeState === undefined) {
				changeState = true;
			}
			
			if (changeState) {
				History.pushState(null, null, url);
			} else {
				this.run(url);
			}
			
			return this;
		},
		
		control: function() {
			var moduleName		= this.getRequest().getParam('module', 'index'),
				controllerName	= this.getRequest().getParam('controller', 'index'),
				actionName		= this.getRequest().getParam('action', 'index'),
				controllerClass, 
				controllerInstance = this._controllerInstances[moduleName];
				
			if (!(controllerInstance instanceof Start.Lib.Controller)) {
				Start.Tools.log('starting:',moduleName, this._modules[moduleName]);
				if (this._modules[moduleName]) {
					controllerClass = this._modules[moduleName][controllerName];
					if (controllerClass !== undefined) {
						controllerInstance = new controllerClass;
						controllerInstance.setContext(this);
						if (_.isFunction(controllerInstance.onInit)) {
							controllerInstance.onInit.call(controllerInstance);
						}
					}
				}
			}
			
			if (controllerInstance instanceof Start.Lib.Controller) {
				if (this._currentController != controllerInstance
					&& this._currentController instanceof Start.Lib.Controller) {
					if (_.isFunction(this._currentController.onLeaveContext)) {
						this._currentController.onLeaveContext.call(this._currentController);
					}
				}
				controllerInstance.setContext(this);
				if (this._currentController != controllerInstance
					&& _.isFunction(controllerInstance.onEnterContext)) {
					controllerInstance.onEnterContext.call(controllerInstance);
				}
				if (_.isFunction(controllerInstance[actionName+'Action'])) {
					controllerInstance[actionName+'Action'].call(controllerInstance);
				}
				this._currentController = controllerInstance;
				this._controllerInstances[moduleName] = controllerInstance;
			}
			
			return this;
		}
	});
	
	Start.bootstrap = function(setup) {
		new (Start.Lib.Bootstrap.extend({
			setup: setup
		}));
	};
	
	root.Start = Start;
})(window, window.jQuery, History, window._, window._str);