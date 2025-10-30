# Atomic

Hello, Thanks for taking the time to look at the work. It was an enjoyable experience going through the assessment. Just as a clarification which I'm sure you've gathered from my experience, I've spent the last 4 years primarily working in Blazor. React is new to me and my previous experience was in vue.js, it's been feeling familiar and easy enough picking the javascript style frameworks back up but there's a lot that i'm still a little rusty with and haven't had time with this technical assessment to properly reaquaint myself with so there's a few things that I'm not happy with that I'll mention. I didn't have time to get properly set back up with vs code as well so for the purposes of this project I've commited the cardinal sin of running the react app in visual studio. Hopefully that doesn't cause issues if you're running it properly in vs code, but there's a chance it might.

Setup

Backend/Database

The project was built to be run on a localhost SQL Express database. 

When you have the local Database up and running: 

Create the Database (I called mine AtomicDB)

Run the publish.xml file in the the Database/AtomicDB.SQL project. This should bring up a UI to connect to the local Db database. You can either publish directly to it, or generate a script to then run into the database manually. If running the script manually make sure SQLCMD mode is enabled (Query Dropdown -> SQLCMD Mode near the bottom) before you hit Execute.

This will create the database structure required. 

For the API - There's two settings in the appsettings.Development.json file to enter, the AtomicDB connection string and the CORS localhost value. Hopefully these should be the same as the values there but if not then they should just need updating. 

This should let the API then run and you should be able to explore the end points via the swagger page. 

Front End

Hopefully it should just be a case of installing the required packages via npm install and then running the solution. The base URL for the API is currently hardcoded into the the BaseService.ts file, this is awful, I know it's awful and wouldn't get deployed anywhere other than localhost. I just ran out of time to get the local environment variables (visual studio probably didn't help). You might just need to check that this is the same as your API url. 


Design Considerations (In no particular order as they're copied from my notes as I was working) 

Some general notes
DelegateDecompiler usage - Much more maintainability but potential performance costs. Fine for small apps like this but need to be mindful of performance scaling.
I picked to use a component library for speed/functionality compared to hand cranking components. MUI was a nice fit and has accesibility as a priority (WAI-ARIA 1.2). 
Made sure that all deletes are soft deletes.
Implentation of entityIds for databse rows -> shouldn't use sequential Id's as part of API URLs
Dialog popups instead of dedicated pages were used for adding/editing of entities as the modal sizes were small. If they were much bigger I would implement dedicated workflow pages for better UX


Some Improvements I'd like to make:

Add more auditing fields to the User Model like created by etc - Didn't have time to script a solution given a user needs to exist to do this with.
Add a history of auditing to the databse records (for example at my current work, we do this via audit tables and SQL triggers) 
IsCompleted/IsCancelled boolean fields can be made redudant by null checks on the respective date fields but they were specifically requested
Implement base service classes using Types to saving having to repeat basic crud functionality
Move app settings values out of the projects and pull them directly from keyvaults
Login system -> Didn't have time/localhost functionality to Implement proper logins and to implement bearer token logins etc.
Implement extra logging functionality like Serilog etc

Security
Basic CORS blocking and HTTPS redirection was implemented.
SwaggerUI only available in the dev environment.

Security Improvements:

Authentication (We use Microsoft Identity with our Azure stack).
Authorization: [Authorize], policies, roles) to control access to endpoints or resources.
Data protection & encryption: (TLS/HTTPS), Transparent Data Encryption in SQL Server etc
Input validation / sanitisation: Protect against injection attacks (SQL injection, XSS)
Secure configuration: Don’t store secrets in source code; use secure vaults (Azure Key Vault), environment variables, configuration providers.
Secret management: Rotate/expire keys, avoid hard-coded passwords, restrict access to production environments.
Logging & monitoring: Track failed logins, suspicious patterns, use audit logs.
Dependency management: Keep libraries and frameworks up to date (patch vulnerabilities). Use static analysis tools (e.g., SonarQube) to detect code smells/security issues.


Scalability Improvements

Database - Normalization/TNFs, Appropriate Data Types, Indexing, Partitioning/Splitting, Execution Plans
Async Calls, Connection Management. Read/Write Boxes and Read only to allow horizontal scaling, caching of data, message queues for long running or non-critical tasks.

Make sure entity framework calls are properly structured with correct includes and where problems, avoid n+1 situations. 
Keep the API stateless to allow more scaling/load balancing. 
Microservices to distribute the architecture




