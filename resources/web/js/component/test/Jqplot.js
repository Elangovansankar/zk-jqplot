(function() {

	zk.afterMount(function() {

	});

	var Jqplot = component.Jqplot = zk.$extends(zk.Widget,
			{

				_title : '', // default value for title attribute
				_type : 'line', // default value for chart type
				_orient: 'vertical',
				_model : null,
				_cursor : false,
				_highlighter : false,

				$define : {
					title : function() {
						if (this.desktop) {
						}
					},

					type : function() {
						if (this.desktop) {
							zk.log("setType", this);
						}
					},
					
					orient : function() {
						
					},
					
					cursor : function() {
						
					},
					
					highlighter : function() {
						
					},

					model : function() {
						if (this.desktop) {
							zk.log('setModel', this);
						}
					},
					series : null,
				},

				bind_ : function() {
					
					this.$supers(component.Jqplot, 'bind_', arguments);
					
//					zk.log("bind", this);
					
//					this.domListen_(this.$n('chart'),"onClick","doClick_");
//					zWatch.listen({onClick: this});
					
					var dataModel = this.getModel();
					var data = jq.evalJSON(dataModel);
					
//					var dd = [];
//					var current = data[0];
//					for(key in current) {
//						zk.log(current[key], this);
//						dd.push([current[key]]);
//					}
//					
//					zk.log(dd[0]);
					
					// Log all data
//					for(var i = 0, len = data.length; i < len; i++) {
//						var current = data[i];
//						for(key in current) {
//							zk.log(current[key], this);
//						}
//					}

					// define plot
					var series = []; // series label
					var seriesData = []; // series data value
					var axes = {}; // axes setting
					var ticks = []; // label for x-axis or y-axis 
					var seriesDefaults = {}; // how do we render chart
					var stackSeries = false; // stack chart
					var cursor = { show : false};
					var highlighter = { show : false};

					/**
					 * values:Q1, xxx:20, yyy:40 
					 * values:Q2, xxx:35, yyy:60 
					 * values:Q3, xxx:40, yyy:70 
					 * values:Q4, xxx:55, yyy:90
					 */
					
					// Step 1. Parse JSON data into jqplot format
					if( this._type == 'pie') {
						
						for ( var i = 0, len = data.length; i < len; i++) {
							
							var current = data[i];
							seriesData.push([current['categoryField'], current['dataField']]);
						}
						
						seriesData = [ seriesData ];
						
					} else {
						for ( var i = 0, len = data.length; i < len; i++) {
	
							var current = data[i];
	
							var count = 0;
							for (key in current) { 
								
								if (key == 'values') { // Ticks
									ticks.push(current.values); // Q2, Q3, Q4
								} else {
									
									// Initial Array
									if(!seriesData[count]) {
										seriesData[count] = new Array();
									}
									
									// Push Data
									if(this._orient != 'horizontal') {
										seriesData[count].push(current[key]);
									} else {
										var ind = seriesData[count].length + 1;
										seriesData[count].push([current[key], ind]); // data
									}
									// Next Series
									count++;
								}
							}
						}
					}
					
					// Debug - to check horizontal format is correct or not
//					var cc = seriesData[0];
//					for(var i = 0, len = cc.length; i < len; i++) {
//						zk.log(cc[i][0]);
//						zk.log(cc[i][1]);
//					}
					
					/**
					 * After parse (Vertical)
					 * seriesData = [ [Q1 Value List], [Q2 Value List].... ]
					 * After parse (Horizontal)
					 * seriesData = [ 
					 * 		[ [ Q1 Value, 1], [ Q2 Value, 2] ,...., [Qn Value, n ] ],
					 * 		[ [ Q1 Value, 1], [ Q2 Value, 2] ,...., [Qn Value, n ] ],
					 * ]
					 */
					
					// This series is for testing purpose
					//var testSeries = [ [[20,1] ,[35,2], [40, 3], [55, 4]], [[20,1] ,[35,2], [40, 3], [55, 4]] ];
					
					// End Step 1.
					
					
//					for(var i = 0, len = seriesData.length; i < len; i++) {
//						var current = seriesData[i];
//						for(key in current) {
//							zk.log(current[key], this);
//						}
//					}			
					
					// Step 2. Decide which type chart should be plot.
					
					if(this.isBarType()) {
						
						// Bar common
						seriesDefaults.renderer = $.jqplot.BarRenderer;
						if(this._orient == 'horizontal') {
							seriesDefaults.rendererOptions = {
								fillToZero : true,
								barDirection: 'horizontal',
							};
						}
						
						// Stack
						if(this._type == 'stacked_bar') {
							stackSeries = true;
						}
						
					} else if(this.getType() == 'area') {
						stackSeries = true;
						seriesDefaults.fill = true;
					} else if(this.getType() == 'pie') {
						seriesDefaults = {
								renderer: jQuery.jqplot.PieRenderer, 
								rendererOptions: {
									showDataLabels: true
								}
						};
						axesDefaults = null;
					}
					
					// Horizontal or Vertical ?
					if(this.getType() != 'pie')
						if(this._orient != 'horizontal') {
							// Vertical
							axes.xaxis = {
								renderer : $.jqplot.CategoryAxisRenderer,
								ticks: ticks
							};
							axes.yaxis = { autoscale : true };				
						} else {
							// Horizontal
							axes.xaxis = { autoscale : true };
							axes.yaxis = {
								renderer : $.jqplot.CategoryAxisRenderer,
								ticks: ticks
							};
						}
					
					// Options
					if(this._cursor) {
						cursor = {
							show: true,
							tooltipLocation:'sw'
						};
					}
					
					if(this._highlighter) {
						highlighter = {
							show: true,
						    sizeAdjust: 7.5
						}
					}
					
					// End Step 2
					
					// Step 3. Plot
					var wgt = this;
				    
					var jqplot = $.jqplot(this.$n('chart').id, seriesData, {
						title : wgt.getTitle(),
						series: series,
						stackSeries: stackSeries,					
						seriesDefaults : seriesDefaults,
						axesDefaults : {
							tickRenderer : $.jqplot.CanvasAxisTickRenderer,
						},
						axes : axes,
						legend: {
				            show: true,
				            placement: 'outsideGrid'
				        },
				        cursor: cursor,
				        highlighter: highlighter,
					});
					
					// End Step 3.
					
					// Listen onClick
					if(this.isListen("onClick")) {
						var _seriesIndex, _pointIndex, _data;
						$('#' + this.$n('chart').id).bind('jqplotDataClick', 
							function (ev, seriesIndex, pointIndex, data, plot) {
								_seriesIndex = seriesIndex;
								_pointIndex = pointIndex;
								_data = data;
								wgt.fire("onClick", {
									seriesIndex : _seriesIndex,
									pointIndex : _pointIndex,
									data : _data,
									ticks : ticks
								});
							}
						);
					}				

				},
				
				unbind_ : function() {
					this.$supers(component.Jqplot, 'unbind_', arguments);
//					this.domUnlisten_(this.$n('chart'),"onClick","doClick_");
//					zWatch.unlisten({onClick: this});
				},
				
				setRefresh : function() {
					zk.log("setRefresh", this);
				},
				
				isBarType : function() {
					if(this._type == 'bar' || this._type == 'stacked_bar') {
						return true;
					}
					return false;
				},

				getZclass : function() {
					return this._zclass != null ? this._zclass : "z-jqplot";
				}

			});

})();
