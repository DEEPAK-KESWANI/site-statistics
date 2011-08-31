<#escape x as jsonUtils.encodeJSONString(x)>
[
<#list years as year>
{
   <#assign data = stats[year]>
   <#assign datakeys = data?keys>
   <#list datakeys as datakey>
   "${datakey}":"${data[datakey]}"
   <#if datakey_has_next>,</#if>
   </#list>
 
}<#if year_has_next>,</#if>
</#list>
]

</#escape>
