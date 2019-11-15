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
| *11/1* | *172, #187* | *#201, #179, #178* | *Client Schema validation* | 
| *11/4* | *#201, #179, #178* | *#209, #181, #180* | *Database* | 
| *11/6* | *#209, #181* | *#222, #192, #180* | *Database* | 
| *11/8* | *#222, #192, #180* | *#173, #217, #197, #177* | *Database* | 
| *11/11* | *#173* | *#217, #197, #177* | *Database* | 
| *11/13* | *#217, #197, #177* | *none* | *none* | 


## Review (focus on solution and technology)

In this sprint, we implemented the shorter trip function, in which a trip is rearranged according to the 2-opt algorithm to create shorter total distance, and we implemented JSON validation for requests to, and responses from the server. We also implemented a variety of ways to modify the trip, including rearranging it, adding new locations, removing locations, and reversing the order of the itinerary. Additionally, we added some GUI configurations with the ability to turn map markers on and off for specific locations, and adjust the size and color of the markers. Finally, we are able to search the regional database, however we do not display the results on the website. 

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *#1: Modify Trip*
* *#2: API Validation*
* *#3: TIP v4*
* *#4: Shorter Trip*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *#5: Worldwide: Can request and get response, but not show user the results.

#### What went well

We implemented GUI changes and changes to the itinerary table effectively. We finished up what we needed from Sprint 3.

#### Problems encountered and resolutions

The lack of progress at the beginning did not help the overall progress and led to a rush. Many projects and tests were going on during this time and the class got put on hold for a bit. But once things settled down we were able to work more on this project.


## Retrospective (focus on people, process, tools)

In this sprint we had a hard time keeping up with the daily need of this project and everyone being available in class to talk about the sprint. We did complete a lot during the sprint, but was becoming more rushed during the last half.

#### What we changed this sprint

Our changes for this sprint included having better communication on slack, which did improve and helped when everyone was not able to meet.

#### What we did well

We were able to focus more on this sprint when our other classes finished their tests and projects. 
We communicated what each of us needed to work on well, and also communicated to each other what we had done. This avoided any stepping on toes.

#### What we need to work on

We could improve on everyone being present at the scrum meetings and being on track for what needs to be completed and what we are working on. We need to be more verbal about our other commitments and work around them (jobs, tests, other projects, etc.).
We could also improve our divide-and-conquer team strategy. When we work in an isolated fashion, it is easier to get stuck on certain tasks.

#### What we will change next sprint 

We will continue to have our daily scrum meetings, but also include time to update each other on our availability to work on this project in order to keep on track. If someone has less time, they will take shorter/easier tasks.

We will also improve our communication on where we our having difficulties in order to help each other out.
