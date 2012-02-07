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
			this.switchPage(this.getRequest().getRouteRaw());
			Start.Tools.log('indexAction');
		},
		
		page1Action: function() {
			this.switchPage(this.getRequest().getRouteRaw());
			Start.Tools.log('page1Action');
		},
		
		page2Action: function() {
			this.switchPage(this.getRequest().getRouteRaw());
			Start.Tools.log('page2Action');
		},
		
		switchPage: function(rawRoute) {
			if (!this.getRequest().getIsInitial()) {
				Start.Tools.safeAJAX($.get(rawRoute, function(response) {
					var newContent = $(response).find('#content').html();
					$('#content').fadeOut(function() {
						$(this).html(newContent).fadeIn();
					});
				}));
			}
		}
	});
	
	$('a.ajax').click(_.bind(function(e) {
		e.preventDefault();
		var self = $(e.currentTarget);
		this.invokeUrl(self.attr('href'));
		return false;
	}, this));
});
