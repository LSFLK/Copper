go.Modules.register("legacy", "scanbox");

GO.mainLayout.onReady(function(){
	if(!go.Modules.isAvailable("legacy", "scanbox")) {
		return;
	}
	Ext.TaskMgr.start({
		run: function(){

			GO.request({
				url: 'scanbox/scanbox/scan',
				success: function(options, response, result)
				{
					if(!result.success)
					{
						Ext.MessageBox.alert(t("Error"), t("Could not connect to the server. Please check your internet connection."));
					}else
					{
						if(result.filesfound){
							if(!GO.scanbox.fileFoundDialog)
								GO.scanbox.fileFoundDialog = new GO.scanbox.FileFoundDialog();

							GO.scanbox.fileFoundDialog.show();
						}
					}
				},
				scope:this
			});

		},
		scope:this,
		interval:60000 // Check every minute
	});
});
