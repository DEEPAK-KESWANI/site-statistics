package org.alfresco.util;

import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
/**
 * Utility class for Dates
 * @author vandana.pal
 *
 */
public class DateUtils 
{
	public static final String DATE_FORMAT_ALFRESCO = "yyyy-MM-dd HH:mm:ss.SSS";

	private static final String separator = "-";
	private final static Log LOGGER = LogFactory.getLog(DateUtils.class);

	/**
	 * Method will convert String to Date Object
	 * @param str
	 * @return
	 */
	public static Date strToDate(String str, String format)
	{
		DateFormat dateFormat = new SimpleDateFormat(format);
		Date date = null;
		try
		{
			date = dateFormat.parse(str);
		} catch (ParseException e)
		{
			LOGGER.error("Date dose not match with the Required Format");
			LOGGER.error(e.getMessage());
		}
		return date;
	}

	/**
	 * Build dates on the basis of start and end of year
	 * @param startYear
	 * @param endYear
	 * @return
	 */
	public static Map<String, String[]> buildDates(int startYear , int endYear )
	{
		Map<String, String[]> dateRangeMap = new LinkedHashMap<String, String[]>();
		if(endYear - startYear !=0)
		{
			for( int row = startYear ; row <= endYear; row++)
			{
				String[] dateRange = new String[2];
				dateRange[0]= row + separator + "01" + separator + "01T00:00:00.000";
				dateRange[1]= row + separator + "12" + separator + "31T23:59:59.999";
				dateRangeMap.put(String.valueOf(row), dateRange);
			}
		}
		else
		{
			String[] shortMonths = new DateFormatSymbols().getShortMonths();
			Calendar calendar = Calendar.getInstance();
			for (int i = 0; i <shortMonths.length-1; i++)
			{
				String[] dateRange = new String[2];
				calendar.set(startYear, i, 1);
				dateRange[0]= startYear + separator + (i+1) +separator+calendar.getActualMinimum(Calendar.DAY_OF_MONTH)+ "T00:00:00.000";
				dateRange[1]= startYear + separator + (i+1) +separator+calendar.getActualMaximum(Calendar.DAY_OF_MONTH)+"T23:59:59.999";
				dateRangeMap.put(shortMonths[i], dateRange);
			}
		}
		return dateRangeMap;
	}

}
