# Sprint 3 - *t11* - *Team America*

## Goal

### Shorter trips to more places!
### Sprint Leader: *Aaron Huskerson*

## Definition of Done

* Version in pom.xml should be `<version>3.0.0</version>` for your final build for deployment.
* Increment release `v3.0` created on GitHub with appropriate version number and name.
* Increment `server-3.0.jar` deployed for testing and demonstration on SPRINT3 assignment.
* Sprint Review, Restrospective, and Metrics completed (team/sprint3.md).


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
* Code Coverage above 40%
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

* *#1: Short Trip*
* *#2: Distance Units*
* *#3: Use Logging Facility*
* *#4: Distance Calculator*
* *#5: Trips*
* *#6: System*
* *#7: TIP v4*

## Notes and Diagrams

* Plan on merging Itinerary tab in Calculator tab
* Create drop down menu for distance units to reduce back and forth between options tab

![Client Hierarchy](/team/images/ClientHierarchyDiagram.jpeg?raw=true "Client Hierarchy")

![Server Hierarchy](/team/images/ServerHierarchyDiagram.PNG?raw=true "Server Hierarchy")

![Webpage Elements](/team/images/Sprint3_Diagram1.jpg?raw=true "Webpage Elements")


## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *7* | *4* |
| Tasks |  *16*   | *19* | 
| Story Points |  *18*  | *23* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *10/7* | *none* | *none* | *Initial Planning and bug fixes* |
| *10/9* | *#109* | *#111, #117* | *none* |
| *10/11* | *#111, #117* | *#110* | *none* |
| *10/14* | *#110* | *#59,#65, #144* | *none* |
| *10/16* | *#59, #65* | *#118, #145, #156, #144* | *none* |
| *10/18* | *#118, #145, #156, #144* | *#119, #164* | *none* |
| *10/21* | *#119* | *#164* | *none* |
| *10/23* | *#164* | *none* | *none* |


## Review (focus on solution and technology)

In this sprint, we focused on Itinerary and Short Trip. We were able to condense a lot of our code to be more efficient and are able to read and manipulate itinerary files. Our nearest neighbor algorithm works great and works relatively fast depending on the task.

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *#1: Short Trip*
* *#2: Distance Units*
* *#5: Trips*
* *#7: TIP v4*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *#3: Use Logging Facility*: Didn't have enough time.
* *#4: Distance Calculator*: Started implimentation but did not finish.
* *#6: System*: Did not understand full and got pushed back.

#### What went well

Our team was able to complete some of the major epics and we were able to get less sidetracked with other epics/tasks. We were better this sprint at asking for help when we needed it and stuck well to the process in GitHub.


#### Problems encountered and resolutions

Our communication could have been better between what has been completed and what needs to be completed. We started off in groups on epics, but as it came closer to crunch time we did our own epics. However this led to there being some complications. Our goal for next sprint is to start early as a team and end early. We will communicate our work better in order to lessen confusion.


## Retrospective (focus on people, process, tools)

In this sprint, we had a hard time balancing this project and midterms/other projects. We were able to work well together and ask each other for help when we needed it. The tools CodeClimate and Travis helped with our process and sped things along, leading to less breaks in code and more prevention.

#### What we changed this sprint

Our changes for this sprint included working in groups on epics in the beginning. This worked for a bit, but schedule got busy. Keeping on top of this will be a main priority for next sprint.

#### What we did well

We were able to use the helpful tools of CodeClimate and Travis which helped with debugging and creating more clean code. The layout of CodeClimate allowed our group to have similar looking code without communicating about it too much.

#### What we need to work on

We need to work more on daily communication as opposed to out daily scrum every Monday, Wednesday, and Friday. 

#### What we will change next sprint 

We need to communicate more daily. Keeping each other updated on progress daily will help us all stay on the same page. Maybe like a daily blast in the morning or night will be able to help with that.
