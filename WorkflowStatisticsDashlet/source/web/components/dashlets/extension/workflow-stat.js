(function()
{
  /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
       Cookie = YAHOO.util.Cookie,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths;
      
      
   /**
    * Dashboard WorkflowStatistics constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.WorkflowStatistics} The new component instance
    * @constructor
    */
   Alfresco.dashlet.WorkflowStatistics = function WorkflowStatistics_constructor(htmlId)
   {
      return Alfresco.dashlet.WorkflowStatistics.superclass.constructor.call(this, "Alfresco.dashlet.WorkflowStatistics", htmlId,["animation"]);
   };
    /**
    * Extend from Alfresco.component.Base and add class implementation
    */
   YAHOO.extend(Alfresco.dashlet.WorkflowStatistics, Alfresco.component.Base,
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
         userId: "",
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
          endYear:""
         
         
      },
       /**
       * Fired by YUI when parent element is available for scripting.
       * @method onReady
       */
       onReady: function WorkflowStatistics_onReady()
       {
            Event.addListener(this.id + "-configure-link", "click", this.onConfigClick, this, true);
            if(Cookie.get("customJsessionId") != Cookie.get("JSESSIONID"))
            {
                  this.options.userId = Alfresco.constants.USERNAME ;
                  var date = new Date();
                  this.options.startYear = date.getFullYear();
                  this.options.endYear = date.getFullYear();
            } 
            else
            {
                this.options.userId = Cookie.get("userId");
                this.options.startYear =Cookie.get("startYear");
                this.options.endYear = Cookie.get("endYear");
            }

            this.refreshTitle();
            this.chartHandler();
       },
       
      /**
       * Opens Configuration Dialog
       * @method onConfigClick
       * @param e {object} HTML event
       */
       onConfigClick: function WorkflowStatistics_onConfigClick(e)
       {
          var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlets/workflow-stat/config/" + encodeURIComponent(this.options.componentId);
          Event.stopEvent(e);
         
         if (!this.configDialog)
         {
            this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog");
			
			this.configDialog.setOptions(
            {
               width: "30em",
               templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlets/workflow-stat/config", 
			   actionUrl: actionUrl,
               onSuccess:
               {
                  fn: function WorkflowStatistics_onConfigFeed_callback(response)
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
                       Cookie.set("userId", this.options.userId);             
                       Cookie.set("startYear", this.options.startYear);       
                       Cookie.set("endYear", this.options.endYear);  
                       Cookie.set("customJsessionId", Cookie.get("JSESSIONID"));  
                       //Refreshing labels for User and Year based on data entered
                       this.refreshTitle();
                       //For preparing Charts
                       this.chartHandler();
                       
                     } 
                  },
                  scope: this
               },
			   onFailure:
				{
				   fn: function WorkflowStatistics_onConfigFeed_failure(response)
				   {
					  Alfresco.util.PopupManager.displayMessage(
					  {
						 text: this.msg("Unable to Process Request")
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
	   *@method refreshTitle
	   */
	   refreshTitle: function WorkflowStatistics_refreshTitle()
       {
            Dom.get("userName").innerHTML = this.options.userId;
            Dom.get("yearRange").innerHTML = this.options.startYear + "-" + this.options.endYear;
           
       },
       
	   /**
		*For preparing Charts
		*@method chartHandler
	   */
       chartHandler: function WorkflowStatistics_chartHandler()
       {
          YAHOO.widget.Chart.SWFURL =  Alfresco.constants.URL_CONTEXT  + "res/yui/charts/assets/charts.swf";
            
            //Fetching Data from Repository on the basis of filtered criteria
			var wscriptUrl = Alfresco.constants.PROXY_URI + "ui/workflow-statistics?userId=" + this.options.userId + "&startYear=" + this.options.startYear + "&endYear=" + this.options.endYear; 	
			var wfDataSource = new YAHOO.util.DataSource( wscriptUrl );
			wfDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
			wfDataSource.responseSchema =
			{
				fields: [ "year", "CompletedWorkflows","ActiveWorkflows" ]
			};

			var taskSeriesDef =
                  [
                        { 
                              displayName: "ActiveWorkflows",
                              yField: "ActiveWorkflows",
                              showInLegend:true, 
                              style:
                              {           
                                    borderColor:0x00B8BF,
                                    fillColor:0x00B8BF
                             }
                      },
                        { 
                              displayName: "CompletedWorkflows", 
                              yField: "CompletedWorkflows",
                              showInLegend:true, 
                              style:
                            { 
                                    borderColor:0xFFA928,
                                    fillColor:0xFFA928
                            } 
                        }
                  ];


			
			YAHOO.example.getDataTipText = function( item, index, series )
			{
				var toolTipText = series.displayName + " for " + item.year;
				toolTipText += "\n" + " \#" + item[series.yField];
				return toolTipText;
			}
			YAHOO.example.getLegendLabelText = function(value)
            {
                        return value;
            }

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

			
			var wfNumericAxis = new YAHOO.widget.NumericAxis();
			wfNumericAxis.minimum = 0;
			wfNumericAxis.title="Workflow Task";
			wfNumericAxis.stackingEnabled = true; 
			
			var yearAxis = new YAHOO.widget.CategoryAxis(); 
			yearAxis.title = "Time Period"; 
			
			//Preparing the Chart
			var wfStatChart = new YAHOO.widget.StackedColumnChart( "taskBarChart", wfDataSource,
			{
			    wmode: "transparent",
				series: taskSeriesDef,
				xField: "year",
				xAxis: yearAxis,
				yAxis: wfNumericAxis,
				style: styleDef,
				dataTipFunction: YAHOO.example.getDataTipText,
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



