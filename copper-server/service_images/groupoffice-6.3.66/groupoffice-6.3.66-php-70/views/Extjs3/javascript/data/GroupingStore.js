GO.data.GroupingStore = function(config) {

	

	GO.data.GroupingStore.superclass.constructor.call (this, config);
	
	this.on('load', function(){
		this.loaded=true;
		
		if(this.reader.jsonData.feedback){	
			GO.errorDialog.show(this.reader.jsonData.feedback);
		}
		
	}, this);
	
	this.on('loadexception',		
		function(proxy, store, response, e){

			if(response.status==0)
			{
				//silently ignore because auto refreshing jobs often get here somehow??
				//GO.errorDialog.show(t("Could not connect to the server. Please check your internet connection."), "");
			}else if(!this.reader.jsonData || GO.jsonAuthHandler(this.reader.jsonData, this.load, this))
			{		
				var msg;

				if(!GO.errorDialog.isVisible()){
					if(this.reader.jsonData && this.reader.jsonData.feedback)
					{
						msg = this.reader.jsonData.feedback;
						GO.errorDialog.show(msg);
					}else
					{
						msg = t("An error occurred on the webserver. Contact your system administrator and supply the detailed error.");
						msg += '<br /><br />JsonStore load exception occurred';
						GO.errorDialog.show(msg);
					}
				}		
					
			}
		}
		,this);
};

Ext.extend(GO.data.GroupingStore, Ext.data.GroupingStore, {
	loaded : false	
	
});
	
