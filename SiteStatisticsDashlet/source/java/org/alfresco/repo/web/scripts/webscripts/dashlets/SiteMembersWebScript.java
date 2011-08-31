package org.alfresco.repo.web.scripts.webscripts.dashlets;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.site.SiteModel;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.ResultSetRow;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.service.cmr.security.AuthorityService;
import org.alfresco.service.cmr.security.AuthorityType;
import org.alfresco.service.cmr.security.PermissionService;
import org.alfresco.service.cmr.site.SiteService;
import org.alfresco.web.bean.workflow.ManageTaskDialog;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptStatus;

/**
 * Webscript implementation for getting members of a specfic site.
 * 
 * @author vandana.pal
 * 
 */
public class SiteMembersWebScript extends DeclarativeWebScript
{
    private String userName;
    private String shortName;
    private AuthorityService authorityService;
    private PermissionService permissionService;
    private SearchService searchService;
    private SiteService siteService;
    private final static Log LOGGER = LogFactory.getLog(SiteMembersWebScript.class);
    
    @SuppressWarnings("deprecation")
	protected Map<String, Object> executeImpl(WebScriptRequest req, WebScriptStatus status)
    {
        Map<String, Object> members = new HashMap<String, Object>();
        userName = req.getParameter("query").toLowerCase();
        shortName = req.getExtensionPath().split("/")[0];
        String permission = null;
        Set<String> permissions = permissionService.getSettablePermissions(SiteModel.TYPE_SITE);
        List<String> filteredUserList = new ArrayList<String>();
        //get the users on the basis of  permission for specific site
        if (LOGGER.isDebugEnabled()){
        	LOGGER.debug("Searchin for User: " + userName);
        	LOGGER.debug("Site Name: "+ shortName);
        }
        for (Iterator<String> permIterator = permissions.iterator(); permIterator.hasNext();)
        {
            permission = (String) permIterator.next();
            String groupName = siteService.getSiteRoleGroup(shortName, permission);
            Set<String> users = authorityService.getContainedAuthorities(AuthorityType.USER, groupName, true);
            for (String user : users)
            {
                boolean addUser = false;
                if ((userName != null) && (userName.length() != 0)) //&& (!(userName.equals(user)))
                {
                    addUser = matchPerson(userName, user);
                    if(LOGGER.isDebugEnabled()){
                    	LOGGER.debug("User" + userName + "Member  of site :" + addUser);
                    }
                }
                if (addUser)
                {
                    filteredUserList.add(user);
                }
            }
        }
        
        members.put("userName", filteredUserList);
        return members;
    }

   /**
   * This checks the filter value matches the username 
   * @param nameFilters
   * @param username
   * @return
   */
    private boolean matchPerson(String nameFilters, String username)
    {
    	
        boolean addUser = false;

        String query = "+TYPE:\"cm:person\" +@cm\\:userName:\"" + username + "\"";
        
        SearchParameters searchParameters = new SearchParameters();
        searchParameters.setLanguage("lucene");
        searchParameters.addStore(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE);
        searchParameters.setQuery(query);
        ResultSet resultSet = searchService.query(searchParameters);
        try
        {
            if (resultSet.length() != 0)
            {
                ResultSetRow row = resultSet.getRow(0);
                Map values = row.getValues();
                String userName = (String) values.get(ContentModel.PROP_USERNAME.toString()); 
                String lowUserName = (userName != null) ? userName.toLowerCase() : "";
                if (lowUserName.startsWith(nameFilters))   
                {
                    addUser = true;    
                }
                
            }

        } finally
        {
            resultSet.close();
        }

        return addUser;
    }

    public AuthorityService getAuthorityService()
    {
        return authorityService;
    }

    public void setAuthorityService(AuthorityService authorityService)
    {
        this.authorityService = authorityService;
    }

    public PermissionService getPermissionService()
    {
        return permissionService;
    }

    public void setPermissionService(PermissionService permissionService)
    {
        this.permissionService = permissionService;
    }

    public SearchService getSearchService()
    {
        return searchService;
    }

    public void setSearchService(SearchService searchService)
    {
        this.searchService = searchService;
    }


        public SiteService getSiteService() {
                return siteService;
        }


        public void setSiteService(SiteService siteService) {
                this.siteService = siteService;
        }

    
}
