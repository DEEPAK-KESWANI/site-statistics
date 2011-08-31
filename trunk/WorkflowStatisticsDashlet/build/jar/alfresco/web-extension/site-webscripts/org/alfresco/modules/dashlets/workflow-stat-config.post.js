/**
* Get the entered Data by user and pass it to dashlet
*/
function main()
{
   var jsonObj = jsonUtils.toObject(requestbody.content);     
   model.userId = jsonObj.userId;
   model.startYear = jsonObj.startYear;
   model.endYear = jsonObj.endYear;
   model.yearRangeCheck = jsonObj.rangeCheck;
}
main();