(function() {

	zk.afterMount(function() {
	});

	var Jqplot = component.Jqplot = zk.$extends(zk.Widget,
			{

				_title : '',
				_type : 'line',
				_orient: 'vertical',
				
				_cursor : false,
				_highlighter : false,
				_stackSeries : false,
				
				$define : {
					title: null,
					type: null,
					
					model : null,
					series : null,
					seriesData : null,
					seriesDefaults : null,
					axes : null,
					ticks : null,
					
					orient : null,				
				},
				
				_dataPrepare : function() {
					var dataModel = this.getModel();
					var data = jq.evalJSON(dataModel);
					
					// In this phase, we need to decide following variables
					var seriesData = [];
					var ticks = [];
					
					// Start data prepare
					if( this.getType() == 'pie') {
						
						for ( var i = 0, len = data.length; i < len; i++) {
							
							var current = data[i];
							seriesData.push([current['categoryField'], current['dataField']]);
						}
						
						seriesData = [ seriesData ];
						
					} else {
						for ( var i = 0, len = data.length; i < len; i++) {
	
							var current = data[i];
	
							var count = 0;
							for (var key in current) { 
								
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
					// End data prepare
					
					this.setSeriesData(seriesData);
					this.setTicks(ticks);
					
				},
				
				_chartPrepare : function() {
					
					var wgt = this;
					// In this phase, we need to decide following variables
					var axes = {};
					var seriesDefaults = {};
					
					// Start chart prepare
					if(this.isBarType()) {
						
						// Bar
						seriesDefaults.renderer = $.jqplot.BarRenderer;
						if(this._orient == 'horizontal') {
							seriesDefaults.rendererOptions = {
								fillToZero : true,
								barDirection: 'horizontal'
							};
						}
						
						// Stack
						if(this._type == 'stacked_bar') {
							this._stackSeries = true;
						}
						
					} else if(this.getType() == 'area') {
						this.stackSeries = true;
						seriesDefaults.fill = true;
					} else if(this.getType() == 'pie') {
						seriesDefaults = {
								renderer: jQuery.jqplot.PieRenderer, 
								rendererOptions: {
									showDataLabels: true
								}
						};
					}
					
					// Horizontal or Vertical ?
					if(this.getType() != 'pie') {
						if(this._orient != 'horizontal') {
							// Vertical
							axes.xaxis = {
								renderer : $.jqplot.CategoryAxisRenderer,
								ticks: wgt.getTicks(),
							};
							axes.yaxis = { autoscale : true};				
						} else {
							// Horizontal
							axes.xaxis = { autoscale : true };
							axes.yaxis = {
								renderer : $.jqplot.CategoryAxisRenderer,
								ticks: wgt.getTicks(),
							};
						}
					}
					
					// End chart prepare
					
					this.setAxes(axes);
					this.setSeriesDefaults(seriesDefaults);
				},
				
				_chartPlot : function() {
					var wgt = this;
					var jqplot = $.jqplot(this.$n('chart').id, wgt.getSeriesData(), {
						title : wgt.getTitle(),
						stackSeries: wgt._stackSeries,
						seriesDefaults : wgt.getSeriesDefaults(),
						axesDefaults : {
							tickRenderer : $.jqplot.CanvasAxisTickRenderer
						},
						axes : wgt.getAxes(),
						legend: {
				            show: true,
				            placement: 'outsideGrid'
				        },
				        cursor: wgt.getCursor(),
				        highlighter: wgt.getHighlighter()
					});
				},

				bind_ : function() {
					
					this.$supers(component.Jqplot, 'bind_', arguments);
					
					// Step 1
					this._dataPrepare();	
					
					// Step 2
					this._chartPrepare();
					
					// Step 3
					this._chartPlot();
					
					var wgt = this;
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
									ticks : wgt.getTicks()
								});
							}
						);
					}

				},
				
				unbind_ : function() {
					this.$supers(component.Jqplot, 'unbind_', arguments);
				},
				
				
				isBarType : function() {
					if(this._type == 'bar' || this._type == 'stacked_bar') {
						return true;
					}
					return false;
				},				
				
				getCursor : function() {
					if(this._cursor) {
						return { show: true, tooltipLocation:'sw' };						
					} else {
						return { show: false };
					}
				},
				
				setCursor : function(val) {
					this._cursor = val; 
				},
				
				getHighlighter : function() {
					if(this._highlighter) {
						return { show: true, sizeAdjust: 7.5 };
					} else {
						return { show: false };
					}
				},
				
				setHighlighter : function(val) {
					this._highlighter = val; 
				},

				getZclass : function() {
					return this._zclass != null ? this._zclass : "z-jqplot";
				}

			});

})();
