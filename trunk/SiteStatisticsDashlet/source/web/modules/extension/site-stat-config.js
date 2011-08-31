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
   var siteID=null;   
      
      /**
    * Dashboard SiteStatConfigDialog constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.SiteStatConfigDialog} The new component instance
    * @constructor
    */
   Alfresco.dashlet.SiteStatConfigDialog = function SiteStatConfigDialog_constructor(htmlId)
   {
      return Alfresco.dashlet.SiteStatConfigDialog.superclass.constructor.call(this, "Alfresco.dashlet.SiteStatConfigDialog", htmlId,["animation"]);
   };
   
   YAHOO.extend(Alfresco.dashlet.SiteStatConfigDialog, Alfresco.component.Base,
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
          * The siteId , used to get the members of the site
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
      onReady: function SiteStatConfigDialog_onReady()
      {
            Event.addListener("rangeCheck", "click", this.getEndYearOptions, this, true);
		    siteID = this.options.siteId
            Event.onAvailable(this.id+"-configDialog-range-start-menu", this.populateYear);
            Event.onAvailable(this.id+"-configDialog-range-end-menu", this.populateYear);
            Event.onAvailable("myAutoComplete", this.remoteHandler);
            Event.addListener("userId", "keyup", this.isSpecialChar, this, true); 
            
     }, 
   
   
       
    /**
    *  Poupulates Start and End year combobox. Last 5 years
    */ 
    populateYear : function SiteStatConfigDialog_populateYear()
    {
      var cur_date = new Date();
      var cur_year = cur_date.getFullYear();
      var index =0;
        for(i = 5,j=0; i >= 0; i--,j++)
        {
         
        	Dom.get(this.id).options[j] = new Option(cur_year-i,cur_year-i);
            index =j;
        }
        Dom.get(this.id).options[index].selected=true;
   },
   
   /**
   * Autocomplete feature to fetch site members
   */
   remoteHandler :  function SiteStatConfigDialog_remoteHandler() {
			
			
	   Dom.get("rangeCheck").focus();
	   Dom.get("rangeCheck").click();
			
			// Use an XHRDataSource
			var webScriptURL =  Alfresco.constants.PROXY_URI + "/ui/" + siteID + "/site-members";
			var oDS = new YAHOO.util.XHRDataSource(webScriptURL);
			oDS.responseType = YAHOO.util.LocalDataSource.TYPE_JSON;
			oDS.responseSchema = {
				resultsList : "Response",
				fields : ['userName']
			};
			
			// Instantiate the AutoComplete
			var oAC = new YAHOO.widget.AutoComplete("userId", "myContainer", oDS);
			oAC.prehighlightClassName = "yui-ac-prehighlight";
			oAC.useShadow = true;
				
			return {
				oDS: oDS,
				oAC: oAC
			};
		},
	   /**
	   * Enable/Disable End year Option
	   */
	   getEndYearOptions: function SiteStatConfigDialog_getEndYearOptions() 
		{ 
			if(Dom.get("rangeCheck").checked) 
                   {
                         Dom.setStyle(this.id + '-configDialog-range-year', "display", "none");
                         Dom.setStyle(this.id + '-configDialog-range-start-year', "display", "block");
                         Dom.setStyle(this.id + '-configDialog-range-end-menu', "display", "block");
                         Dom.setStyle(this.id + '-configDialog-range-end-year', "display", "block");
                   } 
                   else 
                   {
                          Dom.setStyle(this.id + '-configDialog-range-year', "display", "block");
                         Dom.setStyle(this.id + '-configDialog-range-start-year', "display", "none");
                         Dom.setStyle(this.id + '-configDialog-range-end-menu', "display", "none");
                         Dom.setStyle(this.id + '-configDialog-range-end-year', "display", "none");
                    }
			
		},
		
   /**
   * Validation for Special Character in UserName
   */
   isSpecialChar : function isSpecialChar()
   {        
                  var id = "userId";
                  var illegalChars = "><|?\\";   
                  var strToSearch = Dom.get(id).value;
                  var isSpclChar = false;
                  for (var i = 0; i < strToSearch.length; i++)
                  {     
                        if (illegalChars.indexOf(strToSearch.charAt(i)) != -1)
                        {                 
                              isSpclChar = true;                  
                        }
                  }
                  
                  if(isSpclChar)
                  {
                        Alfresco.util.PopupManager.displayMessage(
                        {
                                text: this.msg("UserName is invalid")
                        });
                                
                        Dom.get(id).focus();
                        Dom.get(id).value="";
                        return false;
                  }
                  
                  return true;
    } 
   });
})();
