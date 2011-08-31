package org.alfresco.workflow.util;

import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
/**
 * This class is used to execute queries 
 * @author amita.bhandari
 *
 */
public class AlfrescoUtils 
{
	/**
	 * count no. of tasks against  required date
	 * @param createdDate
	 * @param startYear
	 * @param endYear
	 * @param workflows
	 */
	public static void getNoOfTaskForDateRange(String createdDate  , int startYear , int endYear,Map<String , String> workflows)
    {
    		Date  inputDate = DateUtils.strToDate(createdDate,DateUtils.DATE_FORMAT_ALFRESCO);
        	int month = inputDate.getMonth();
        	SimpleDateFormat simpleDateformat=new SimpleDateFormat("yyyy");
        	int year= Integer.parseInt(simpleDateformat.format(inputDate));
        	String[] shortMonths = new DateFormatSymbols().getShortMonths();
        	int value = 1;
        	if(endYear == startYear && year == startYear)
        	{ 
        		if(workflows.containsKey(shortMonths[month]))
        		{
        			
        			value = Integer.parseInt(workflows.get(shortMonths[month]))+1;
        		}
        		workflows.put(shortMonths[month], String.valueOf(value));
        	}
        	else
        	{
        		if(year >= startYear  &&  endYear >= year)
        		{
        			if(workflows.containsKey(String.valueOf(year)))
            		{
            			
            			value = Integer.parseInt(workflows.get(String.valueOf(year)))+1;
            		}
        			workflows.put(String.valueOf(year), String.valueOf(value));
        		}
        	}
    }
}
