Site Statistics Social Content  component for Alfresco Share
=======================================================

Author: Vandana Pal

This project defines a site statistics component to display no. of documents,wiki,blogs and posts in a graphical view.

Installation
------------

The component has been developed to install on top of an existing Alfresco
3.4 installation.


To build the JAR file, run the following command from the base project 
directory. Also specify the alfresco.sdk.dir location in build.properties.

    ant  dist-jar

The command should build a JAR file named site-statistics.jar
in the 'dist' directory within your project/build folder.

To install the component, drop the site-statistics.jar file into the following two 
directories within your Alfresco installation, and restart the application server.

    tomcat/webapps/alfresco/WEB-INF/lib
    tomcat/webapps/share/WEB-INF/lib 
    
Once you have run this you will need to restart Tomcat so that the classpath 
resources in the JAR file are picked up.

Using the component
-------------------

Log in to Alfresco Share as any  user . Configure Social Content Statistics dashlet for any site from 'site dashboard'