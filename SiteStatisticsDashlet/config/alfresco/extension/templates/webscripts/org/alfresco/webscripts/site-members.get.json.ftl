<#escape x as jsonUtils.encodeJSONString(x)>
{
"Response":
[
<#list userName as name>
{
    "userName":"${name}" 	
}<#if name_has_next>,</#if>
</#list>
]
}
</#escape>