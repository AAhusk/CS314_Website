# Sprint 4 - *t11* - *Team America*

## Goal

### Worldwide!
### Sprint Leader: *Chandler Day*

## Definition of Done

* Version in pom.xml should be `<version>4.0.0</version>` for your final build for deployment.
* Increment release `v4.0` created on GitHub with appropriate version number and name.
* Increment `server-3.5.jar` deployed for testing and demonstration on CHECK4 assignment.
* Increment `server-4.0.jar` deployed for testing and demonstration on SPRINT4 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint4.md).


## Policies

#### Mobile First Design!
* Design for mobile, tablet, laptop, desktop (in that order).
* Use ReactStrap for a consistent interface (no HTML, CSS, style, etc.).
* Must adhere to the TripCo Interchange Protocol (TIP) for interoperability and testing.
#### Clean Code
* Code Climate maintainability of A or B.
* Code adheres to Google style guides for Java and JavaScript.
#### Test Driven Development
* Write method headers, unit tests, and code in that order.
* Unit tests are fully automated.
* Code Coverage above 50%
#### Configuration Management
* Always check for new changes in master to resolve merge conflicts locally before committing them.
* All changes are built and tested before they are committed.
* All commits include a task/issue number.
* All commits include tests for the added or modified code.
* All tests pass.
#### Continuous Integration / Delivery 
* Master is never broken.  If broken, it is fixed immediately.
* Continuous integration successfully builds and tests all pull requests for master branch.
* All Java dependencies in pom.xml.  Do not load external libraries in your repo. 


## Plan

This sprint will complete the following Epics.

* *#1: Modify Trip*
* *#2: API Validation*
* *#3: TIP v4*
* *#4: Shorter Trip*
* *#5: Worldwide*
* *#6: Distance Units*

## Notes and Diagrams

![Client Hierarchy](/team/images/SP4_Client_Hierarchy.jpg?raw=true "Client Hierarchy")

![Server Hierarchy](/team/images/SP4_Server_Hierarchy.jpg?raw=true "Server Hierarchy")

![Webpage Elements](/team/images/SP4_Client_Component_Layout.jpg?raw=true "Webpage Elements")


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *6* | *5* |
| Tasks |  *14*   | *20* | 
| Story Points |  *20*  | *20* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *10/28* | *none* | *#167, #171, #201* | *none* | 
| *10/30* | *#167, #171* | *#172, #187, #179, #178* | *none* | 
| *11/1* | *172, #187* | *#201, #179, #178* | *none* | 
| *11/4* | *#201, #179, #178* | *#209, #181, #180* | *Database* | 
| *11/6* | *#209, #181* | *#222, #192, #180* | *Database* | 
| *11/8* | *#222, #192, #180* | *#173, #217, #197, #177* | *Database* | 
| *11/11* | *#173* | *#217, #197, #177* | *Database* | 
| *11/13* | *#217, #197, #177* | *none* | *none* | 


## Review (focus on solution and technology)

In this sprint, we focused on Worldwide and easier better planning. The ModifyTrip epic and itinerary have been updated accordingly and allow for a better user experience. The Database request was done late and using search results has not been implemented yet.

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *#1: Modify Trip*
* *#2: API Validation*
* *#3: TIP v4*
* *#4: Shorter Trip*
* *#6: Distance Units*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *#5: Database: Can request and get response, but not show user the results.

#### What went well

The amount of epics completed went well.


#### Problems encountered and resolutions

The lack of progress at the beginning did not help the overall progress and led to a rush. Many projects and tests were going on during this time and the class got put on hold for a bit. But once things settled down we were able to work more on this project.


## Retrospective (focus on people, process, tools)

In this sprint we had a hard time keeping up with the daily need of this project and everyone being available in class to talk about the sprint. We did complete a lot during the sprint, but was becoming more rushed during the last half.

#### What we changed this sprint

Our changes for this sprint included having better communication on slack, which did improve and helped when everyone was not able to meet.

#### What we did well

We were able to focus more on this sprint when our other classes finished their tests and projects.

#### What we need to work on

We could improve on everyone being present at the scrum meetings and being on track for what needs to be completed and what we are working on. We need to be more verbal about our other commitments and work around them (jobs, tests, other projects, etc.).

#### What we will change next sprint 

We will continue to have our daily scrum meetings, but also include time to update each other on our availability to work on this project in order to keep on track. If someone has less time, they will take shorter/easier tasks.
