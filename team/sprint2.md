# Sprint 2 - t11 - Team America

## Goal
The goal is to implement the initial functionality of the calculator; the user will be able to enter in 2 sets of coordinates, and see the distance between them following the curve of the earth. Additionally, we want to update the map's functionality; the user will be able to see their current location on the map, and they will be able to load a trip(created from another tool) that will display on our map. Finally, we would like to implement the ability to rearrange a trip so that it is optimized to be as short as possible.

### A map and itinerary!
### Sprint Leader: *Sean Boyd*

## Definition of Done
* Every Epic is completed, along with associated tasks.
* Version in pom.xml should be `<version>2.0.0</version>` for your final build for deployment.
* Increment release `v2.0` created on GitHub with appropriate version number and name.
* Increment deployed for testing and demonstration on SPRINT2 assignment.
* Sprint Review and Restrospectives completed (team/sprint2.md).
* Team is satisfied with output and the main goal described above is complete.


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

* #1 Where am I: show the user their exact location on the map if available.
* #2 Vincenty: Write the code implementation of the Vincenty formula for finding the distance between two locations on a sphere.
* #3 Display Map and itinerary: implement the ability to load a trip itinerary obtained from another tool, in the standard format of TIP JSON, and show this trip on the map with an update itinerary. 
* #4 Geographic coordinate validation: validate the geographic coordinates, and if they are in an invalid format, report this to the user in a user-friendly way.
* #5 Short trip: rearranges a given trip to minimize distance and travel time.
* #6 Geographic coordinate formats: the calculator will support many different coordinate formats, so that the coordinates can be copied from different sources.

Key planning decisions for this sprint include ...
1. Putting 2 people on each epic.
2. Rotating which 2 people are working together.
3. Making a time frame for each epic at around 5 days for the pair working on it.
4. Pushing to master at least after each epic, incrementally confirming that epics/tasks are working as expected.

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *7* | *8* |
| Tasks |  *11*   | *22* | 
| Story Points |  *18*  | *45* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *9/23* | *#63, #62, #78* | *#57, #55* | *none* | 
| *9/25* | *#55 #57 #88* | *#68 #76 #77* | *Re-implementing Vincenty after learning we need to use the sphere equation* | 
| *9/27* | *#55 #68* | *#64 #94* | *Figuring out how to read in data* | 
| *9/30* | *#64 #94* | *#56 #66* | *none* | 
| *10/2* | *#64* | *none* | *none* |


## Diagrams

(Diagram 1 shows the different elements of the webpage, and their respective components in the client)
![Diagram 1](https://github.com/csucs314f19/t11/blob/Sprint2-Plan/team/images/Sprint2Components2.0.jpg)

(Diagram 2 shows the client hierachy of what props are passed to child components)
![Diagram 2](https://github.com/csucs314f19/t11/blob/Sprint2-Plan/team/images/clientHierarchy.jpg)


(Diagram 3 shows the server hierarchy of the interactions between each restful API service)
![Diagram 3](https://github.com/csucs314f19/t11/blob/Sprint2-Plan/team/images/serverHierarchy.jpg)


## Review (focus on solution and technology)

In this sprint, we spent a lot of time trying to figure out the codebase and work together on who would be responsible doing
what. We hadn't really gotten completely comfortable assigning tasks to each other, working in mini-groups, or 
using github to it's full extent, but we got there in the end and really started performing. We had a couple
problems when implementing our algorithms (like implementing the wrong vincenty code) but we worked as a team to get
through it, and actually helped each other out instead of just doing everything individually.

#### Completed epics in Sprint Backlog 

These Epics were completed.

* *Current Configuration*
* *Where Am I*
* *Geographic Coordinate Format*
* *Vincenty*
* *Distance Calculator*
* *Geographic Coordinate Validation*
* *Distance Units*
* *Display Map and Itinerary*

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

* *Short Trip*
* *Use Logging Facility*

#### What went well

We completed 6 epics which is what we were hoping for. We also balanced our work pretty well throughout the three weeks.


#### Problems encountered and resolutions

One problem was learning how to read input from a file for the trip itinerary epic; Sean let us know his trouble with this so we were aware of the hold-up and could help if he needed it. Being aware of each other's hold-ups helps make sure we stay on progress. 
Another problem was incorrectly implementing a library for the ellipsoid equation of Vincenty, when we were supposed to do the sphere equation. This was clarified in class, and from there we made the necessary change.


## Retrospective (focus on people, process, tools)

In this sprint, we could have done a lot more but we kind of put
stuff off until the last week or so. I think we did this
because we underestimated the amount of work that actually
goes into learning an entirely new codebase and system,
and so spent a lot of time assuming we could just do the work
later.

#### What we changed this sprint

We changed how we approach tasks - for this sprint specifically,
it was easier for us to take one person per epic, and then have
that person ask questions to his teammates if they have
questions. This seemed to work well because it allows all
of us to sort-of work on all the epics to know what is going
on between all of the moving parts, but also be able to
really focus on one at a time, and treat that person as 
the expert of their epic.

#### What we did well

We were really good at communicating how are schedules are,
what problems we were having, and reaching out to other
team members if we were stuck on something. All of us
are starting to understand how things work too, and
so are able to help each other out more effectively.

#### What we need to work on

We could improve on starting the projects sooner rather than later
in order to iron out any kinks we have with the codebase
early on, and not push it forward to the last week.

We could also work on the balancing of work-life scheduling,
because sometimes other classes get in the way of this
one.

#### What we will change next sprint 

In the next sprint we will try to work better together as
a team by increasing our understanding of the subject 
matter, doing work at the beginning of the sprint, and 
making sure we ask for help when we need it, which includes
bouncing ideas off of team members.
