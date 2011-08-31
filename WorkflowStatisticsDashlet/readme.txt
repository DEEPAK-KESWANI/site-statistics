Workflow Statistics  component for Alfresco Share
=======================================================

Author: Deepak Keswani

This project defines a Workflow Statistics component to display no. Active tasks, completed tasks for any user in a graphical view.

Installation
------------

The component has been developed to install on top of an existing Alfresco
3.4 installation.


To build the JAR file, run the following command from the base project 
directory.Also specify the alfresco.sdk.dir location in build.properties as  data webscript is created in java.

    ant  dist-jar

The command should build a JAR file named workflow-statistics.jar
in the 'dist' directory within your project/build folder.

To install the component, drop the workflow-statistics.jar file into the following two 
directories within your Alfresco installation, and restart the application server.

    tomcat/webapps/alfresco/WEB-INF/lib
    tomcat/webapps/share/WEB-INF/lib 
    
Once you have run this you will need to restart Tomcat so that the classpath 
resources in the JAR file are picked up.

Using the component
-------------------

Log in to Alfresco Share as any  user . Configure Workflow Statistics dashlet from  'my  dashboard'