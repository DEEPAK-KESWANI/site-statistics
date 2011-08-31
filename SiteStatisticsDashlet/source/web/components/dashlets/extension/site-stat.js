(function()
{
  /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
       $combine = Alfresco.util.combinePaths;
      
      
   /**
    * Dashboard SiteStatistics constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.SiteStatistics} The new component instance
    * @constructor
    */
   Alfresco.dashlet.SiteStatistics = function SiteStatistics_constructor(htmlId)
   {
      return Alfresco.dashlet.SiteStatistics.superclass.constructor.call(this, "Alfresco.dashlet.SiteStatistics", htmlId,["animation"]);
   };
   
   /**
    * Extend from Alfresco.component.Base and add class implementation
    */
   YAHOO.extend(Alfresco.dashlet.SiteStatistics, Alfresco.component.Base,
   {
   
      options:
      {
         /**
          * The component id, used to persist dashlet configuration.
          *
          * @property componentId
          * @type string
          * @default ""
          */
         componentId: "",
         /**
          * The username , used to show the statistics for that user
          *
          * @property userId
          * @type string
          * @default current Logged-In User
          */
         userId: Alfresco.constants.USERNAME,
         /**
          * The startYear , used to filter the statistics
          *
          * @property startYear
          * @type string
          * @default current Year
          */
         startYear:"",
         /**
          * The endYear , used to filter the statistics
          *
          * @property endYear
          * @type string
          * @default current Year
          */
         endYear:"",
         /**
          * The siteId , used to get the statistics of particular site
          *
          * @property siteId
          * @type string
          * @default ""
          */
         siteId:""
         
      },
      /**
       * Fired by YUI when parent element is available for scripting.
       * @method onReady
       */
       onReady: function SiteStatistics_onReady()
       {
           
            Event.addListener(this.id + "-configure-link", "click", this.onConfigClick, this, true);
            var date = new Date();
            this.options.startYear = date.getFullYear();
            this.options.endYear = date.getFullYear();
            this.refreshTitle();
            this.chartHandler();
         
       },
       /**
       *
       * Opens Configuration Dialog
       * @method onConfigClick
       * @param e {object} HTML event
       */
       onConfigClick: function SiteStatistics_onConfigClick(e)
       {
          var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlets/site-stat/config/" + encodeURIComponent(this.options.componentId);
          Event.stopEvent(e);
         
         if (!this.configDialog)
         {
            this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog");
			
			this.configDialog.setOptions(
            {
               width: "30em",
               templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlets/site-stat/config", 
			   actionUrl: actionUrl,
               onSuccess:
               {
                  fn: function SiteStatistics_onConfigFeed_callback(response)
                  {
                      if(response.json.data.userId == "" ||  response.json.data.userId == "*")
  					  {  
     					 response.json.data.userId = "ALL";
 					  } 
                      if(response.json.data.yearRangeCheck != "on")
                      {
                          response.json.data.endYear = response.json.data.startYear;
                      }
                     if (this.options.userId != response.json.data.userId || this.options.startYear != response.json.data.startYear
                     || this.options.endYear != response.json.data.endYear)
                     {
                       this.options.userId = response.json.data.userId;
                       this.options.startYear = response.json.data.startYear;
                       this.options.endYear = response.json.data.endYear;
                       //Refreshing labels for User and Year based on data entered
                       this.refreshTitle();
                       //Populating Stacked Bar Charts.
                       this.chartHandler();
                       
                     }
                  },
                  scope: this
               },
			   onFailure:
				{
				   fn: function SiteStatistics_onConfigFeed_failure(response)
				   {
					  Alfresco.util.PopupManager.displayMessage(
					  {
						 text: this.msg("message.dashlet.failure")
					  });
					  
				   },
				   scope: this
				},
				
				doSetupFormsValidation:
	               {
	                  fn: function SiteStatistics_doSetupForm_callback(form)
	                  {
	                    this.configDialog.form.addValidation("userId", Alfresco.forms.validation.mandatory, null, "keyup");
	                    this.configDialog.form.addValidation(this.configDialog.id+"-range-start-menu",this.startyearValidation,
	                    {
	                         endYearContainerEl: Dom.get(this.configDialog.id + "-range-end-menu"),
	                         rangeCheckContainerEl: Dom.get("rangeCheck")   
	                    },"change");
	                                       
	                    
	                    this.configDialog.form.addValidation(this.configDialog.id+"-range-end-menu",this.endyearValidation,
	                    {
	                         endYearContainerEl: Dom.get(this.configDialog.id + "-range-start-menu"),
	                         rangeCheckContainerEl: Dom.get("rangeCheck")   
	                    },"change");
	                    
	                                       
	                    this.configDialog.form.addValidation("rangeCheck",this.dataValidation,
	                    {
	                         endYearContainerEl: Dom.get(this.configDialog.id + "-range-end-menu"),
	                         strtYearContainerEl: Dom.get(this.configDialog.id+"-range-start-menu"),
	                            
	                    },"change");
	                    
	                    this.configDialog.form.setShowSubmitStateDynamically(true, false);
	                  },
	                   scope: this
	               }

              
            });
         }
         else
         {
            this.configDialog.setOptions(
            {
               actionUrl: actionUrl
            })
         }
        this.configDialog.show();
         
       },
	   /**
	   * Refreshing labels for User and Year based on data entered
	   * @method refreshTitle
	   */
	   refreshTitle: function SiteStatistics_refreshTitle()
       {
            Dom.get("userName").innerHTML = this.options.userId;
            Dom.get("yearRange").innerHTML = this.options.startYear + "-" + this.options.endYear;
           
       },
       
	   /**
	    *For preparing Stacked Bar Charts.
	    *@method chartHandler
	    */
       chartHandler: function SiteStatistics_chartHandler()
       {
           YAHOO.widget.Chart.SWFURL =  Alfresco.constants.URL_CONTEXT  + "res/yui/charts/assets/charts.swf";

			//Fetching Data from Repository on the basis of filtered criteria
			var wscriptUrl = Alfresco.constants.PROXY_URI + "ui/site-statistics?" + "siteId=" + this.options.siteId + "&userId=" + this.options.userId + "&startYear=" + this.options.startYear + "&endYear=" + this.options.endYear; 	
			var contentDataSource = new YAHOO.util.DataSource( wscriptUrl );
			contentDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			contentDataSource.responseSchema =
			{
				fields: [ "year", "Documents", "Blogs", "Discussion", "Wiki"  ]
			};


			var contentSeriesDef =
                [
                      { 
                        displayName: "Documents", 
                        yField: "Documents",
                        showInLegend:true, 
                        style:
                        {         
                                  borderColor:0x00B8BF,
                                  fillColor:0x00B8BF
                        }
                      },
                      { 
                        displayName: "Blogs",
                        yField: "Blogs",
                        showInLegend:true, 
                        style:
                        {
                                borderColor:0xFFE912,
                                  fillColor:0xFFE912
                        }
                        
                      },
                      { 
                        displayName: " Wiki",
                        yField: "Wiki",
                        showInLegend:true, 
                        style:
                        {
                                  borderColor:0xE91D25,
                                  fillColor:0xE91D25
                        }
                      },
                      { 
                            displayName: "Discussion",
                            yField: "Discussion",
                            showInLegend:true,
                            style:
                          { 
                                  borderColor:0xFFA928,
                                  fillColor:0xFFA928
                            } 
                      }
                ];

			YAHOO.example.getLegendLabelText = function(value)
            {
                  return value;
            }

			
			YAHOO.example.getDataTipText = function( item, index, series )
			{
				var toolTipText = series.displayName + " for " + item.year;
				toolTipText += "\n" + " \#" + item[series.yField];
				return toolTipText;
			}
			
			//Style object for chart
            var styleDef =
            {     
                  font:
                  {
                        color:0x333333,
                        name: "Arial",
                        size: 12
                        
                  },
                  xAxis:      
                  {
                        titleFont:{name:"Arial", color:"0x333333", size:13},
                        labelRotation:-90
                  },
                  yAxis:
                  {
                        titleFont:{name:"Arial", color:"0x333333", size:13},  
                        titleRotation:-90
                  },
                  legend:
                  {
                        display: "bottom",
                        padding: 10,
                        spacing: 1,
                        font:
                        {
                              color:0x333333,
                              family: "Arial",
                              size: 11
                        }
                  }                       
            }



			var numericAxis = new YAHOO.widget.NumericAxis();
			numericAxis.minimum = 0;
			numericAxis.title="Social Content";
			numericAxis.stackingEnabled = true; 
			
			var yearAxis = new YAHOO.widget.CategoryAxis(); 
			yearAxis.title = "Time Period"; 
			
			//Preparing the Chart
			var siteStatChart = new YAHOO.widget.StackedColumnChart( "contentBarChart", contentDataSource,
			{
				series: contentSeriesDef,
				xField: "year",
				xAxis: yearAxis,
				yAxis: numericAxis,
				style: styleDef,
				dataTipFunction: YAHOO.example.getDataTipText,
				wmode: "transparent",
				legendLabelFunction: YAHOO.example.getLegendLabelText
			});	
          
       },
       /**
        * Mandatory validation handler, checks year Validations.
        * @method dataValidation
        * @param field {object} Will be the subject field since the recipient fields are hidden
        * @param args {object} Not used
        * @param event {object} The event that caused this handler to be called, maybe null
        * @param form {object} The forms runtime class instance the field is being managed by
        * @param silent {boolean} Determines whether the user should be informed upon failure
        * @param message {string} Message to display when validation fails, maybe null
        * @static
        */
       dataValidation : function mandatory(field, args, event, form, silent, message){
           if(field.checked == true)
           {
              if(args.strtYearContainerEl.value > args.endYearContainerEl.value){
                 return false;
              }
              else{
                  return true;
              }
           }else{
              return true;
           }
       
       },
       /**
        * Mandatory validation handler, checks start year Validations.
        * @method startyearValidation
        * @param field {object} Will be the subject field since the recipient fields are hidden
        * @param args {object} Not used
        * @param event {object} The event that caused this handler to be called, maybe null
        * @param form {object} The forms runtime class instance the field is being managed by
        * @param silent {boolean} Determines whether the user should be informed upon failure
        * @param message {string} Message to display when validation fails, maybe null
        * @static
        */
      startyearValidation: function mandatory(field, args, event, form, silent, message)
      {
         if(args.rangeCheckContainerEl.checked == true)
         {
            if(field.value > args.endYearContainerEl.value)
            {
                  return false;
            }   
            else
            {
                  return true;
            } 
         }
         else{
             return true;
         }
      },
      /**
       * Mandatory validation handler, checks end year Validations.
       * @method endyearValidation
       * @param field {object} Will be the subject field since the recipient fields are hidden
       * @param args {object} Not used
       * @param event {object} The event that caused this handler to be called, maybe null
       * @param form {object} The forms runtime class instance the field is being managed by
       * @param silent {boolean} Determines whether the user should be informed upon failure
       * @param message {string} Message to display when validation fails, maybe null
       * @static
       */
        endyearValidation: function mandatory(field, args, event, form, silent, message)
        {
         if(args.rangeCheckContainerEl.checked == true)
         {
            if(field.value < args.endYearContainerEl.value)
            {
                  return false;
            }   
            else
            {
                  return true;
            } 
         }
         else{
             return true;
         }
      }

   });
})();



