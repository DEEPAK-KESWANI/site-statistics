package org.alfresco.util;

import org.alfresco.repo.web.scripts.webscripts.constants.WebscriptContants;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.web.bean.repository.Repository;
/**
 * This class is used to execute queries 
 * @author pallika.majmudar
 *
 */
public class AlfrescoUtils 
{
	private static SearchService searchService;
	public SearchService getSearchService() 
	{
		return searchService;
	}
	public static void  setSearchService(SearchService searchService1)
	{
		searchService = searchService1;
	}
	/**
	 * execute query on the basis of given parameter
	 * @param query
	 * @return
	 */
	public static int executeQuery(String query)
    {
		int size=0;
        ResultSet resultSet = searchService.query(Repository.getStoreRef(),SearchService.LANGUAGE_LUCENE, query);
        try
        {
            if (resultSet != null)
            {
            size = resultSet.length();
            }
        } 
        finally
        {
            if (resultSet != null)
            {
                resultSet.close();
            }
        }
        return size;
    }
	/**
	 * Dynamic query is generated on the basis of type of web content includes document, wiki , blogs , posts
	 * @param typeOfcontent
	 * @param siteId
	 * @param startDate
	 * @param endDate
	 * @param userId
	 * @return
	 */
	public static String buildQuery(String typeOfcontent,String siteId, String startDate, String endDate,String userId) 
	{
		StringBuffer query = new StringBuffer();
		query.append(WebscriptContants.PATH_QUERY_PREFIX + WebscriptContants.QUOTATION_MARK);
		query.append(WebscriptContants.SITES_PATH);
		query.append("cm:"+ siteId);
		query.append(typeOfcontent);
		if(typeOfcontent.equals(WebscriptContants.DOCUMENT_PATH)){
			query.append("//*" + WebscriptContants.QUOTATION_MARK);
			query.append(" AND ");
			query.append(" + TYPE:\"cm:content\"");
			query.append(" AND ");
			query.append(" - TYPE:\"cm:thumbnail\"");
			query.append(" AND ");
			query.append(" - TYPE:\"cm:failedThumbnail\"");
			query.append(" AND ");
			query.append(" - TYPE:\"cm:systemfolder\"");
			query.append(" AND ");
			query.append(" - TYPE:\"fm:forums\"");
			query.append(" AND ");
			query.append(" - TYPE:\"fm:forum\"");
			query.append(" AND ");
			query.append(" - TYPE:\"fm:topic\"");
			query.append(" AND ");
			query.append(" - TYPE:\"fm:post\"");
		}
		else{
			query.append("/*" + WebscriptContants.QUOTATION_MARK);
		}
		query.append(" AND ");
		query.append("@cm\\:created:[");
		query.append(startDate);
		query.append(" TO ");
		query.append(endDate);
		query.append("]");
		if(userId!=null && !userId.equalsIgnoreCase("ALL"))
		{
			query.append(" AND ");
			query.append("@cm\\:creator:\""+userId+"\"");	
		}
		return query.toString();

	}
}
