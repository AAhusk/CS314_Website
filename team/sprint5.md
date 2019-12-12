# Sprint 5 - *t11* - *Team America*

## Goal

### Mobile release with a beautiful user experience!
### Sprint Leader: *Calvin Davis*

## Definition of Done

* Version in pom.xml should be **`<version>5.0</version>`** for your final build for deployment.
* Increment release **`v5.0`** created on GitHub with appropriate version number and name.
* Increment **`server-5.0.jar`** deployed for testing and demonstration on SPRINT5 assignment.
* Sprint Review, Restrospective, and Metrics completed (**team/sprint5.md**).


## Policies

#### Mobile First Design!
* Design for mobile, tablet, laptop, desktop (in that order).
* Use ReactStrap for a consistent interface (no HTML, CSS, style, etc.).
* Must adhere to the TripCo Interchange Protocol (TIP) for interoperability and testing.
#### Clean Code
* Code Climate maintainability of A (technical debt ratio <= 5).
* Code adheres to Google style guides for Java and JavaScript.
#### Test Driven Development
* Write unit tests before code.
* Unit tests are fully automated.
* Code Coverage above 60%
#### Configuration Management
* Always check for new changes in master to resolve merge conflicts locally before committing them.
* All changes are built and tested before they are committed.
* All commits include a task/issue number.
* All commits include tests for the added or modified code.
* All tests pass.
#### Continuous Integration / Delivery 
* Master is never broken.  If broken, it is fixed immediately.
* All pull requests build and test with no failures.
* All Java dependencies in pom.xml.  Do not load external libraries in your repo. 


## Plan

This sprint will complete the following Epics.

* *#1 Worldwide*
* *#2 Map Clutter*
* *#3 Distance Units*
* *#4 TIP v5*
* *#5 Ease of Use*
* *#6 Auto Optimize*
* *#7 Distance Display*
* *#8 Trip Title*

![Client Hierarchy](/team/images/SP5_Client_Hierarchy.jpg?raw=true "Client Hierarchy")

![Server Hierarchy](/team/images/SP4_Server_Hierarchy.jpg?raw=true "Server Hierarchy")

![Webpage Elements](/team/images/SP4_Client_Component_Layout.jpg?raw=true "Webpage Elements")

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *8* | *8* |
| Tasks |  *18*   | *25* | 
| Story Points |  *40*  | *39* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *11/18* | *none* | *#237, #242* | *none* | 
| *11/20* | *#237, #242* | *#249, #258, #259* | *none* | 
| *11/22* | *#249, #258, #259* | *#256, #257, #250* | *none* | 
| *12/2* | *#256, #257, #250* | *#248, #268, #176, #265, #275, #269* | *none* |
| *12/4* | *#248, #268, #176, #265, #275* | *#261, #278, #255, #283* | *none* |
| *12/6* | *#261, #278, #255, #283, #269* | *#281, #280, #241, #253* | *none* |
| *12/9* | *#281, #280, #241* | *#285, #245, #260* | *none* |
| *12/11* | *#285, #245, #260, #253* | *none* | *none* |


## Review (focus on solution and technology)

In this sprint, we fleshed out the rest of the database items that needed to be completed, including the filters and making sure we could access both region and worldwide. The rest of the sprint was spent ironing out bugs and making things more accessable with MaterialUI.

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *#1 Worldwide: Access worldwide database*
* *#2 Map Clutter: Continuation of map clutter epics from previous sprints*
* *#3 Distance Units: Users should be able to select and modify their own units*
* *#4 TIP v5: Update TIPMD spec*
* *#5 Ease of Use: Redid the UI for the itinerary so it's easier to navigate*
* *#6 Auto Optimize: Simple setting in a dropdown menu*
* *#7 Distance Display: Leg + Cum distances*
* *#8 Trip Title: Modify trip title*

#### What went well

The team really pushed through to get a lot done this sprint. Even over break, several team members were working to make sure things from the last sprint were completed properly, a lot more testing was created, and discussion about how to move forward with different obstacles was had. We finished the database portion, which we've been struggling with in the past, and have moved to making sure everything runs smoothly and looks good for mobile release.


#### Problems encountered and resolutions

The sight for Sprint 5 was lost because we spent a lot of necessary time working on things that we needed to catch up on. So for isntance, we weren't able to look at concurrency at all, which was fine for our needs because we were still able to make a lot of progress on the project.


## Retrospective (focus on people, process, tools)

In this sprint we focus on having more communication and working more consistently on the project. In the past we have had to wait due to projects in other classes. However, this time we broke up the tasks more and focused on what we could do daily while working on other classes. This allowed us to stay on schedule and be more focused.

#### What we changed this sprint

Our changes for this sprint included more communication through slack and the daily scrums. We have reached the norming phase in our group and are more comfortable with asking for help and working together on tasks. We were able to more easily tell if others were stuck and offered them our help if need be.

#### What we did well

We worked more as a group rather than lone wolves that came together here and there. More communication helped us come together and work more as a team. We had a clear idea of what we wanted the project to look like and were able to work together to get that.

#### What we need to work on

We could improve on having a clear timeline of what and when things should be completed in order to have a better idea of how well things are going.

#### What we will change next sprint 

We will change the order in which we focus on some of the epics and tackle the more important ones first. We also need to be better about realisticly estimating the amount of time things will take and potential issues.
