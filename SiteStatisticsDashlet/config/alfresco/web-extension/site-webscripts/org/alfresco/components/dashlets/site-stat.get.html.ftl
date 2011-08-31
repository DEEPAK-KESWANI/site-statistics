<script type="text/javascript">//<![CDATA[
   new Alfresco.dashlet.SiteStatistics("${args.htmlid}").setOptions(
   {
       "siteId": "${page.url.templateArgs.site!""}",
       "componentId": "${instance.object.id}"
      
   });
   
   new Alfresco.dashlet.SiteStatConfigDialog("${args.htmlid}").setOptions(
   {
       "siteId": "${page.url.templateArgs.site!""}",
       "componentId": "${instance.object.id}"
      
   });
//]]></script>
 

   <div class="dashlet yui-skin-sam">

   <div class="title">${msg("header.userDashlet")}</div>
   <div class="toolbar">
   			<a id="${args.htmlid}-configure-link" class="theme-color-1" title="${msg("label.configure")}" href="">${msg("label.configure")}</a>
   </div>

   <div id="filterData" class="filterData">
      <span>&nbsp;</span>
      <span id="userIdlbl" class="filter_label">${msg("label.user")}:</span>
      <span id="userName" class="filter_value">&nbsp;</span>
      <span>&nbsp;</span>
      <span id="yearlbl" class="filter_label">${msg("label.year.range")}:</span>
      <span id="yearRange" class="filter_value">&nbsp;</span>
   </div>


   <div id="contentBarChart" style="height:225px">
   		${msg("info.sitestat")}
   </div>

   </div>


