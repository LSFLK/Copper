GO.grid.ColumnRenderers = {
	
	yesNo : function(val){
		if(val == 1)
			return t("Yes");
		else if(val == 0)
			return t("No");
		else
			return val;
	},
	
	coloredYesNo : function(val, meta, record, rowIndex, columnIndex, store){
		if(val == 1){
			meta.style = 'color:green';
			return t("Yes");
		}else if(val == 0){
			meta.style = 'color:red';
			return t("No");
		}else{
			meta.style = 'color:blue';
			return val;
		}
	},
	
	
	dateExpired : function(val, meta, record, rowIndex, columnIndex, store){
		
		if(typeof val == 'string') {
			var date = Math.round(new Date(val).getTime()/1000);
		} else {
			var date = val;
		}
		
		if(date < Math.round(new Date().now()/1000)){
			meta.style = 'color:red';
			return t("No");
		}
	},

	countryCode: function(val, meta, record, rowIndex, columnIndex, store) {
		return t("countries")[val.toUpperCase()] ? t("countries")[val.toUpperCase()] : val;
	},
	

	/**
	 * To override the maxLength, cutWholeWords, showTooltip params you need 
	 * to add the following to the column.
	 * renderer: {
	 *	fn: GO.grid.ColumnRenderers.Text,
	 *	scope: this
	 * },
	 * 
	 * After that you can set the variables in the grid.
	 * Eg: this.maxLength = 20;
	 * this.cutWholeWords = false;
	 * this.showTooltip = false;
	 * 
	 */
	Text : function(val, meta, record, rowIndex, columnIndex, store){
		
		if(!val)
			return '';
		
		var maxLength = 10;
		var cutWholeWords = true;
		var showTooltip = true;
		
		if(this.showTooltip)
			showTooltip = this.showTooltip;
			
		if(showTooltip)	
			meta.attr = 'ext:qtip="' + Ext.util.Format.nl2br(val) + '"';
		
		if(this.maxLength)
			maxLength = this.maxLength;
		
		if(this.cutWholeWords)
			cutWholeWords = this.cutWholeWords;
		
		if(val.length > maxLength){
			
			val = val.substr(0,maxLength);
			
			if(cutWholeWords){
				var pos = GO.util.strpos(val,' ');
				val = val.substr(0,maxLength,pos);
			}
			
			val = val+' ...';
		}
		
		return val;
	}
}
