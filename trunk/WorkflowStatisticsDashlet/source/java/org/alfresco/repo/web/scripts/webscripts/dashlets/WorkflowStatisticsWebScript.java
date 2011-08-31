package org.alfresco.repo.web.scripts.webscripts.dashlets;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.workflow.WorkflowModel;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.workflow.WorkflowService;
import org.alfresco.service.cmr.workflow.WorkflowTask;
import org.alfresco.service.cmr.workflow.WorkflowTaskQuery;
import org.alfresco.service.cmr.workflow.WorkflowTaskState;
import org.alfresco.workflow.util.AlfrescoUtils;
import org.alfresco.workflow.util.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptStatus;

/**
 * Webscript implementation for getting statistics of pending and completed tasks for each user
 * 
 * @author amita.bhandari, deepak.keswani
 * 
 */
public class WorkflowStatisticsWebScript extends DeclarativeWebScript
{

	private String userId;
	private int startYear;
	private int endYear;
	private WorkflowService workflowService;	
	private SearchService searchService;
	private NodeService nodeService;
	private Map<String,Map<String,Object>> statistics = new LinkedHashMap<String,Map<String,Object>>();
	private List<String> years = new ArrayList<String>();
	private final static Log LOGGER = LogFactory.getLog(WorkflowStatisticsWebScript.class);

	@SuppressWarnings("deprecation")
	protected Map<String, Object> executeImpl(WebScriptRequest req,WebScriptStatus status) 
	{
		statistics.clear();
		//get the values of requested parameters
		getRequestParameters(req);		
		// get the  no. of documents,wiki , blogs , forums for requested year
		getSiteData();
        
		Map<String, Object> data = new LinkedHashMap<String, Object>();
		data.put("stats", statistics);
		data.put("years",years);
		if(LOGGER.isDebugEnabled())
		{
			LOGGER.debug("Workflow Statistics: "  + data.get("stats"));
		}
		return data;
	}
	/**
	 * gets the parameter from request
	 * @param req
	 */
	public void getRequestParameters(WebScriptRequest req)
	{
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
			LOGGER.debug("User Name:" + userId);
			LOGGER.debug("Start Year:" + startYear);
			LOGGER.debug("End Year:" + endYear);
		}
	}
	/**
	 * gets the  No. Of active and completed tasks for a user
	 */
	public void getSiteData()
	{
		Map<String, String[]> dateRange = DateUtils.buildDates(startYear, endYear);
		Set<String> filterDates = dateRange.keySet();
		String startDate = null;
		String endDate = null;
		Map<String,String> activeWorkflows = new LinkedHashMap<String, String>();
		Map<String,String> completedWorkflows = new LinkedHashMap<String, String>();
		if(this.userId!=null)
		{
			activeWorkflows = getNoOfSiteActiveWorkflows();
			completedWorkflows = getNoOfCompletedWorkflows();
		}
		years.clear();
		for (String filterDate : filterDates) 
		{
			years.add(filterDate);
			startDate = dateRange.get(filterDate)[0];
			endDate = dateRange.get(filterDate)[1];
			Map<String, Object> siteData = new LinkedHashMap<String, Object>();			
			siteData.put("year", filterDate);
			if(activeWorkflows.get(filterDate)!=null)
			{
				siteData.put("ActiveWorkflows",activeWorkflows.get(filterDate));
			}
			else
			{
				siteData.put("ActiveWorkflows","0");
			}
			
			if(completedWorkflows.get(filterDate)!=null)
			{
				siteData.put("CompletedWorkflows",completedWorkflows.get(filterDate));
			}
			else
			{
				siteData.put("CompletedWorkflows","0");
			}
			statistics.put(filterDate,siteData);
			if(LOGGER.isDebugEnabled())
			{
				LOGGER.debug("Stats for :" + filterDate + "::" + siteData);
			}
		}
	}
    /**
     * gets no. of completed workflows
     * @return
     */
	public Map<String , String> getNoOfCompletedWorkflows()
	{
		WorkflowTaskQuery query = new WorkflowTaskQuery();
		query.setActive(null);
		if(userId!=null && !userId.equalsIgnoreCase("ALL"))
		{
			query.setActorId(this.userId);
		}
		query.setTaskState(WorkflowTaskState.COMPLETED);
		List<WorkflowTask> tasks = this.getWorkflowService().queryTasks(query);
		Map<String , String> completedTask = new HashMap<String, String>();
		for (WorkflowTask task : tasks)
		{
			         String completionDate = task.getProperties().get(WorkflowModel.PROP_COMPLETION_DATE).toString();
					 AlfrescoUtils.getNoOfTaskForDateRange(completionDate,this.startYear,this.endYear,completedTask);
		}
		return completedTask;
	}
    /**
     * gets no. of active workflows
     * @return
     */
	public Map<String , String> getNoOfSiteActiveWorkflows()
	{
		WorkflowTaskQuery query = new WorkflowTaskQuery();
		// Setting user Id 
		if(userId!=null && !userId.equalsIgnoreCase("ALL"))
		{
			query.setActorId(this.userId);
		}
		List<WorkflowTask> tasks = this.getWorkflowService().queryTasks(query);
		Map<String , String> activeTask =  new HashMap<String, String>();
		for (WorkflowTask task : tasks) 
		{
				String wfcreationDate = task.getProperties().get(ContentModel.PROP_CREATED).toString();
				AlfrescoUtils.getNoOfTaskForDateRange(wfcreationDate,this.startYear,this.endYear,activeTask);
		}
		return activeTask;
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


	public NodeService getNodeService() {
		return nodeService;
	}

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}


}
