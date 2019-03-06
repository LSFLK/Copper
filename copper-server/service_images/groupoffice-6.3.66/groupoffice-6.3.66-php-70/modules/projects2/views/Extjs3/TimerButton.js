GO.projects2.TimerButton = Ext.extend(Ext.Button, {
  initComponent: function() {
//pm-time-entry
    Ext.apply(this, {
      iconCls:'ic-alarm',
      enableToggle: true,
      pressed: this.startTime > 0,
      tooltip: t("Start timer", "projects2"),
      toggleHandler: function(btn, pressed) {
        if (!pressed) {
          if (this.fireEvent('beforestoptimer', this)) {
            this.stopTimer();
          }
          else
            this.toggle(true); //do not unpress the button when the timer isn't stopped
        } else {
          this.startTimer();
        }
      },
      scope: this

    });

    if (this.startTime) {
      this.setRunning(this.startTime);
    }

    this.addEvents({
      stoptimer: true,
      beforestoptimer: true,
      starttimer: true
    });

    GO.projects2.TimerButton.superclass.initComponent.call(this);
  },
  startTime: false,
  setRunning: function(time) {
    this.startTime = Date.parseDate(parseInt(time), 'U');
    this.setTooltip(t("Timer running since", "projects2") + ': ' + this.startTime.format(GO.settings.time_format));
    this.fireEvent('starttimer', this, this.startTime);
  },
  
  afterRender : function(){
	  GO.request({
			url : 'projects2/timer/read',
			success : function(options, success, response) {
				if(response.time && response.time!=0){
				  this.startTime = Date.parseDate(parseInt(response.time), 'U');
				  this.setText(t("Timer running since", "projects2")+': '+this.startTime.format(GO.settings.time_format));
				  this.toggle(true,true);
				}
			},
			scope:this
		});
		GO.projects2.TimerButton.superclass.afterRender.call(this);
	},
  
  stopTimer: function() {

    var elapsed = GO.util.round(this.startTime.getElapsed() / 60000, GO.timeregistration2.roundMinutes, !GO.timeregistration2.roundUp) / 60;
    var startTime = this.startTime;
		
		
		if(!this.timeEntryDialog)
			this.timeEntryDialog = new GO.projects2.TimeEntryDialog({
				id: 'timer-timeentry-dialog'
			});

		this.timeEntryDialog.show(0,{
			loadParams:{
				standardTaskDuration:(elapsed*60),
				start_time: startTime.format('U')
			}
		});

		this.timeEntryDialog.startTime.setValue(startTime);
		this.timeEntryDialog.setEndTime();
		
		
    this.fireEvent('stoptimer', this, elapsed, startTime);

    GO.request({
      url: "projects2/timer/stop",
      success: function(response, options, result) {
        this.setText(t("Start timer", "projects2"));
        this.startTime = false;
        this.toggle(false, true);
      },
      scope: this
    });

    return elapsed;
  },
  startTimer: function() {
    GO.request({
      url: "projects2/timer/start",
      success: function(response, options, result) {
        var data = Ext.decode(response.responseText);
        this.setRunning(data.time);
      },
      scope: this
    });
  }

});
