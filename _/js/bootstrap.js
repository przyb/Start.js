Start.bootstrap(function($, History, _, _str, undefined) {
	this.setRouter(new Start.Lib.Router.Simple);
	
	this.addController('index', 'index', {
		onInit: function() {
			Start.Tools.log(this.getRequest().getRouteRaw()+' index.onInit()');
		},
		
		onEnterContext: function() {
			Start.Tools.log(this.getRequest().getRouteRaw()+' index.onEnterContext()');
		},
		
		onLeaveContext: function() {
			Start.Tools.log(this.getRequest().getRouteRaw()+' index.onLeaveContext()');
		},
		
		indexAction: function() {
			Start.Tools.log(this.getRequest().getParams());
		}
	});
	
	$('a.ajax').click(_.bind(function(e) {
		var self = $(e.currentTarget);
		this.invokeUrl(self.attr('href'));
	}, this));
});
