(function() {

	zk.afterMount(function() {

	});

	function refresh(wgt, dataModel) {
		zk.log('refresh', this);
	}

	var Jqplot = component.Jqplot = zk.$extends(zk.Widget,
			{

				_title : '', // default value for text attribute
				_type : 'line',
				_model : null,

				$define : {
					title : function() {
						if (this.desktop) {
						}
					},

					type : function() {
						if (this.desktop) {

						}
					},

					model : function() {
						if (this.desktop) {
							zk.log('setModel Client Called!', this);
						}
					},
					series : null,
				},

				bind_ : function() {
					this.$supers(component.Jqplot, 'bind_', arguments);

					// zk.log('bind', this);

					var dataModel = this.getModel();
					var data = jq.evalJSON(dataModel);
					
//					var current = data[0];
//					zk.log(current.values, this);

					var series = [];
					var seriesData = [];
					var ticks = [];

					/**
					 * values:Q1, xxx:20, yyy:40 
					 * values:Q2, xxx:35, yyy:60 
					 * values:Q3, xxx:40, yyy:70 
					 * values:Q4, xxx:55, yyy:90
					 */
					
					// Step 1. Parse JSON data into jqplot format
					
					// Pre-fetch the first one, get some basic information
					var current = data[0];
					for(key in current) {
						if(key == 'values') {
							ticks.push(current.values); // Q1
						} else {
							var obj = {label: key};
							series.push(obj); // xxx, yyy
							// Initialize a array for data
							len = series.length - 1;
							seriesData[len] = new Array();
							seriesData[len].push(current[key]);
						}
					}
					
					for ( var i = 1, len = data.length; i < len; i++) {

						var current = data[i];

						var count = 0;
						for (key in current) { 
							
							if (key == 'values') { // Ticks
								ticks.push(current.values);
							} else { // Data
								
								// Push Data
								seriesData[count].push(current[key]); 
								// Next Series
								count++;
								// zk.log(current[key], this);
							}
						}
					}
					
					// End Step 1.
					
					// Step 2. Plot
					var wgt = this;
				    
					var plot = $.jqplot(this.$n('chart').id, seriesData, {
						title : wgt.getTitle(),
						series: series,
						axesDefaults : {
							tickRenderer : $.jqplot.CanvasAxisTickRenderer,
						},
						axes : {
							xaxis : {
								renderer : $.jqplot.CategoryAxisRenderer,
								ticks: ticks
							},
							yaxis : {
								autoscale : true
							}
						},
						legend: {
				            show: true,
				            placement: 'outsideGrid'
				        },						
					});
					
					// End Step 2.

				},

				setRefresh : function(mod) {
					zk.log('setRefresh', this);
					zk.log(mod, this);
					refresh(this, mod);
				},

				unbind_ : function() {
					this.$supers(component.Jqplot, 'unbind_', arguments);
				},

				getZclass : function() {
					return this._zclass != null ? this._zclass : "z-jqplot";
				}

			});

})();
