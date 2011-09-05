/**
* Get the entered Data by user and pass it to dashlet
*/
function main()
{
   var jsonObj = jsonUtils.toObject(requestbody.content), userId = "";    
   userId = jsonObj.userId;
   var component = sitedata.getComponent(url.templateArgs.componentId);
   if (component != null)
   {
      var name;
      for (name in jsonObj)
      {
         if (name == "userId")
         {
            component.properties[name] = String(userId);
         }
         else
         {
            component.properties[name] = String(jsonObj[name]);
         }
      }
      component.save();
   } 
   model.userId = userId;
   model.startYear = jsonObj.startYear;
   model.endYear = jsonObj.endYear;
   model.yearRangeCheck = jsonObj.rangeCheck;
}
main();
