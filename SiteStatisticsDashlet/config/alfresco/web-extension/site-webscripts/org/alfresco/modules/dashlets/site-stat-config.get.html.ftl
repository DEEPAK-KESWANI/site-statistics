<body class="yui-skin-sam">
<div id="${args.htmlid}-configDialog" class="config-site-stat">
<div class="hd">${msg("label.header")}</div>
<div class="bd">

<form id="${args.htmlid}-form" action="">
	<div style="height:180px">   
		<div class="yui-gd">
			<div class="yui-u first">
			   <label for="userId">${msg("label.userName")}:</label>
		   
			</div>
            <div class="yui-u" id="myAutoComplete">
            	<input type="text" name="userId" id="userId"/>
            	 <br><br> 
               <span style="font-size:81%">${msg("message.user.information")}</span>
            	<div id="myContainer"></div>
            </div>
        </div>				
        <div class="yui-gd">
        	<div class="yui-u first"> <label>${msg("label.yearRange")}:</label></div> 
        	<div class="yui-u">
        		<input type="checkbox" id="rangeCheck" name="rangeCheck"/>
        	</div>	
        </div>				
        <div class="yui-gd">	
        	<div class="yui-u first">
        		<label id="${args.htmlid}-range-start-year"  style="display:none">${msg("label.startYear")}:</label>
        		<label id="${args.htmlid}-range-year">${msg("label.year")}:</label>
        	</div>
        <div class="yui-u">
        	<select id="${args.htmlid}-range-start-menu" style="width: 80px;" name="startYear">
        	</select>	  
        </div>	  
     </div>				
     <div class="yui-gd">		
     	<div class="yui-u first">
     		<label id="${args.htmlid}-range-end-year" style="display:none">${msg("label.endYear")}:</label>
     	</div>
     	<div class="yui-u">		
     		<select id="${args.htmlid}-range-end-menu" style="display:none; width: 80px;" name="endYear">
     		</select>
     	</div>
     </div>
  </div>
  <div class="bdft">
  	<input type="button" id="${args.htmlid}-ok" value="${msg("button.ok")}" />
  	<input type="button" id="${args.htmlid}-cancel" value="${msg("button.cancel")}" />
  </div>
  
  </form>
</div>
</div>

