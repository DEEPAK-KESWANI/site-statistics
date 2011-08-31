package org.alfresco.repo.web.scripts.webscripts.dashlets;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.alfresco.repo.web.scripts.webscripts.constants.WebscriptContants;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.workflow.WorkflowService;
import org.alfresco.util.AlfrescoUtils;
import org.alfresco.util.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptStatus;

/**
 * Webscript implementation for getting statistics of Social Content including documents, wiki , blogs , discussion
 * 
 * @author pallika.majmudar
 * 
 */
public class SiteStatisticsWebScript extends DeclarativeWebScript {

	private String userId;
	private String siteId;
	private int startYear;
	private int endYear;
	private WorkflowService workflowService;	
	private SearchService searchService;
	private NodeService nodeService;
	private Map<String,Map<String,Object>> statistics = new LinkedHashMap<String,Map<String,Object>>();
	private List<String> years = new ArrayList<String>();
	private final static Log LOGGER = LogFactory.getLog(SiteStatisticsWebScript.class);

	protected Map<String, Object> executeImpl(WebScriptRequest req,WebScriptStatus status) 
	{
		AlfrescoUtils.setSearchService(searchService);
		statistics.clear();
		//get the values of requested parameters
		getRequestParameters(req);		
		// get the  no. of documents,wiki , blogs , forums for requested year
		getSiteData();
        
		Map<String, Object> data = new LinkedHashMap<String, Object>();
		data.put("stats", statistics);
		data.put("years",years);
		if(LOGGER.isDebugEnabled()){
			LOGGER.debug("SiteData:" + data.get(statistics));
		}
		return data;
	}
	/**
	 * gets the parameter from request
	 * @param req
	 */
	public void getRequestParameters(WebScriptRequest req)
	{
		siteId = req.getParameter("siteId");
		userId = req.getParameter("userId");
		
		if (req.getParameter("startYear") != null)
		{
			startYear = Integer.parseInt(req.getParameter("startYear"));
		} else 
		{
			startYear = Calendar.getInstance().get(Calendar.YEAR);
		}

		if (req.getParameter("endYear") != null) 
		{
			endYear = Integer.parseInt(req.getParameter("endYear"));
		} else 
		{
			endYear = startYear;
		}
		
		if(LOGGER.isDebugEnabled())
		{
			LOGGER.debug("Webscript Request Parameters:");
			LOGGER.debug("SiteId:" + siteId);
			LOGGER.debug("Start Year:" + startYear);
			LOGGER.debug("End Year:" + endYear);
			LOGGER.debug("User Name:" + userId);
		}
	}
	
	/**
	 * gets the  No. Of documents,blogs,wikis,discussion
	 */
	public void getSiteData()
	{
		Map<String, String[]> dateRange = DateUtils.buildDates(startYear, endYear);
		Set<String> filterDates = dateRange.keySet();
		String startDate = null;
		String endDate = null;

		years.clear();
		for (String filterDate : filterDates) 
		{
			years.add(filterDate);
			startDate = dateRange.get(filterDate)[0];
			endDate = dateRange.get(filterDate)[1];
			Map<String, Object> siteData = new LinkedHashMap<String, Object>();			
			siteData.put("year", filterDate);
			siteData.put("Blogs",getNumberOfBlogs(startDate,endDate));
			siteData.put("Wiki",getNumberOfWikiPages(startDate,endDate));
			siteData.put("Discussion",getNumberOfForumTopics(startDate,endDate));
			siteData.put("Documents",getNumberOfDocuments(startDate,endDate));
			statistics.put(filterDate,siteData);
			
		}
	}

	public WorkflowService getWorkflowService() {
		return workflowService;
	}

	public void setWorkflowService(WorkflowService workflowService) {
		this.workflowService = workflowService;
	}


	public SearchService getSearchService() {
		return searchService;
	}

	public void setSearchService(SearchService searchService) {
		this.searchService = searchService;
	}

   /**
    * Gets no. of blogs on the basis  of given date
    * @param startDate
    * @param endDate
    * @return
    */
	private int getNumberOfBlogs(String startDate, String endDate)
	{
		String query = AlfrescoUtils.buildQuery(WebscriptContants.BLOG_PATH,this.siteId,startDate,endDate,this.userId);
		return AlfrescoUtils.executeQuery(query.toString());
	}
    /**
     * Gets no. of wiki pages on the basis  of given date
     * @param startDate
     * @param endDate
     * @return
     */
	private int getNumberOfWikiPages(String startDate, String endDate)
	{

		String query = AlfrescoUtils.buildQuery(WebscriptContants.WIKI_PATH,this.siteId,startDate,endDate,this.userId);
		return AlfrescoUtils.executeQuery(query.toString());
	}

     /**
      * Gets no. of posts on the basis  of given date
      * @param startDate
      * @param endDate
      * @return
      */
	private int getNumberOfForumTopics(String startDate, String endDate)
	{

		String query = AlfrescoUtils.buildQuery(WebscriptContants.DISCUSSIONS_PATH,this.siteId,startDate,endDate,this.userId);
		return AlfrescoUtils.executeQuery(query.toString());
	}
    /**
     * Gets no. of documents on the basis  of given date
     * @param startDate
     * @param endDate
     * @return
     */
	private int getNumberOfDocuments(String startDate, String endDate)
	{

		String query = AlfrescoUtils.buildQuery(WebscriptContants.DOCUMENT_PATH,this.siteId,startDate,endDate,this.userId);
		return AlfrescoUtils.executeQuery(query.toString());
	}


	

	public NodeService getNodeService() {
		return nodeService;
	}

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}


}
