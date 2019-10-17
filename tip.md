# Trip Interchange Protocol (TIP)
## Fall 19, Version 3

This document defines the standard object format that all TripCo clients and servers must use.
This format is shared with other companies to promote interoperabilty.
This object format may be used in files or as the body of a restful API request or response.
The basic format is [JSON](https://www.json.org/) to simplify interactions:  

* between the client and server of the same or different tools,
* when loading or saving a trip using the filesystem.

The key benefits include:

* Saved files may be exchanged between users and used with different clients.
* Clients and servers from different tools may interoperate.
* The best client and server may be selected independently.
* Automated grading with specialized clients and servers for each sprint.

The standard will be updated during the semester to support new requirements.
If you don't understand the standard, ask questions since your grade depends on it.
Requests and replies that do not conform to the standard will receive a grade of 0.
We will not be giving partial credit.

* Questions about the standard should be posted to **Piazza** with a __TIP__ tag.
* You may also request changes to the standard through **Piazza** using the __TIP__ tag.


## TIP objects

A TIP object is a JSON object that contains a set of name/value pairs.
The required version and type elements determine the remaining elements in a particular object.

```javascript
{
  "requestVersion"      : 3,
  "requestType"         : "",
  ...
}
```

Version is a required element that determines which types of objects are supported.
The version will increment with each new release.
Versions are expected to be backwards compatible.

Type is a required element that determines the expected elements in the object.
The type determines the other elements that will appear in the object.

* __config__ objects allow the server to provide configuration information to the client.
* __distance__ objects allow the client to request the distance between two geographic locations from the server.
* __trip__ objects allow the client to request distances between a series of geographic locations that form a round trip, with possible rearrangement.
* __locations__ objects allow the client to request a list of geographics locations matching some criteria

## config

A TIP object of the type __config__ describes the server configuration.
These values are used to tailor the user experience on the client based on server capabilities.
The client sends an `HTTP GET` request to the `/api/config` restful API on the server.
The server responds with a TIP __config__ object.
This example shows:

* the `name` of the web server. 
* the set of `placeAttributes` for places in other TIP objects.

```javascript
{
  "requestType"        : "config",
  "requestVersion"     : 3,
  "serverName"         : "t## name",
  "placeAttrributes"   : ["name","latitude","longitude","id","altitude","municipality","type"],
  "optimizations"      : ["none","short","shorter"]
}
```

The `serverName` element identifies the restful API server instance.
The value should be a string containing the team number and name.
This allows the client to identify which restful API server is currently in use during interoperability testing.

The `placeAttributes` element describes the attributes used to identify place elements in other TIP objects.
The example above shows the set of attributes that must be returned by all servers that support this TIP version.
Other attributes may be present in data and should be preserved.
This allows users to customize the information they wish to display on the client and adapt to future TIP versions.

The `optimizations` element is a list of strings that describes levels of optimization available from the server.
The list should be in increasing order cost that coincides with decreasing distance results.
The value `"none"` should always be the first value in the list and corresponds to no optimization - the `places` list in the **trip** response object is in the same order as the **trip** request object.
For other levels of optimization, the `places` list in the response object may differ from the request object, but the first location in the `places` list should remain the same.  

Other configuration elements will be added in the future versions.


## distance

A TIP object of the type __distance__ is used to obtain the distance between a pair of geographic locations.
This object is used in both the request from the client and the response from the server.
* The client sends an `HTTP POST` request to the `/api/distance` restful API service on the server with a TIP __distance__ object in the request body.
* The server responds with a TIP __distance__ object in the response body with the correct value for the distance.

```javascript
{
  "requestType"    : "distance",
  "requestVersion" : 3,
  "origin"         : {"latitude":  "40.6", "longitude": "-105.1", "name":"Fort Collins, Colorado, USA"},
  "destination"    : {"latitude": "-33.9", "longitude":  "151.2", "name":"Sydney, New South Wales, Australia"},
  "earthRadius"    : 3958.8,
  "distance"       : 0
}
```

The `origin`, `destination`, and `earthRadius` elements are required in the client request while the `distance` element is optional.
The response must include the `origin`, `destination`, and `earthRadius` elements from the request, along with a `distance` element.
The `origin` and `destination` are `key:value` JSON objects that should contain the `placeAttributes` from the configuration.
The `latitude` and `longitude` place attributes should be a string containing signed decimal degrees.


## trip

A TIP object of the type __trip__ is used to obtain the distances between a series of geographic locations that form a round trip and reorder the trip to reduce the distance traveled.
This object is used in both the request from the client and the response from the server.
* The client sends an `HTTP POST` request to the `/api/trip` restful API service on the server with a TIP __trip__ object in the request body.
* The server responds with a TIP __trip__ object in the response body with the correct distances for each leg of the journey.

```javascript
{
  "requestType"    : "trip",
  "requestVersion" : 3,
  "options"        : {},
  "places"         : [],
  "distances"      : []
}
```

The `options` and `places` elements are required in the client request and server response while the `distances` element is optional in the client request and required in the server response.

The `options` element contains a set of `key:value` properties with the keys `title`, `earthRadius`, and `optimization`. 
Only the `earthRadius` property is required.
The `title` is a string for documentation purposes.
The `earthRadius` is a string representing a numeric value.
The `optimization` is a string selected from the values provided in the `optimizations` property of the __config__ object response.

The `optimization` element contains a string taken from the `optimizations` element in the __config__ object the server returns.
This element is optional and is equivalent to `"none"` if not specified.
If the value of `optimization` is `"none"`, the `places` list in the **trip** response object should be identical to the **trip** request object.
For other levels of optimization, the `places` list in the response object may contain the objects in a different order from the request object, but the first location in the `places` list should remain the same.  

The `places` element contains a list/array of objects describing the geographic locations in the trip and may include elements for the `placeAttributes` returned by the __config__ TIP object.
The list of locations in the `places` element represents a round trip, returning from the last item in the list to the first item.
The `name`, `latitude` and `longitude` elements must exist in each place entry.
The `latitude` and `longitude` elements must be specified in signed decimal degrees. 

The `distances` element contains a list/array of integers representing the distances from the corresponding location to the following location, with the last entry representing the distance from the last location back to the first location.

```
{
  "requestType"    : "trip",
  "requestVersion" : 3,
  "options"        : { "title":"My Trip", 
                       "earthRadius":"3958.8",
                       "optimization":"none" },
  "places"         : [{"name":"Denver",       "latitude": "39.7", "longitude": "-105.0"},
                      {"name":"Boulder",      "latitude": "40.0", "longitude": "-105.4"},
                      {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1"}],
  "distances"      : [24, 41, 59]
}
```

TIP __trip__ objects may be stored in files for sharing with other tools.
The `distances` element is optional in a file.
The `latitude` and `longitude` elements are not restricted to signed decimal degrees when stored in a file.
They must be converted from other formats to signed decimal degrees when sent to the server using a Restful API service.


## locations

A TIP object of the type __locations__ is used to obtain a list of geographic locations matching some criteria.
This object is used in both the request from the client and the response from the server.
* The client sends an `HTTP POST` request to the `/api/location` restful API service on the server with a TIP __locations__ object in the request body.
* The server responds with a TIP __locations__ object in the response body with a list of places matching the criteria.

```javascript
{
  "requestType"    : "locations",
  "requestVersion" : 3,
  "match"          : "",
  "limit"          : 0,
  "found"          : 0,
  "places"         : []
}
```

The `match` element is required in the client request and server response.
The `limit` element is optional in the client request and should only appear in the server response if it was provided in the client request.
The `places` and `found` elements are only required in the server response.

The `match` element contains a string used to identify matching geographic locations in the available data sources.
A __locations__ request with `"match":"dave"` should find all locations with the string `"dave"` in the name, municipality, or other identifying columns.
The string may contain alphanumeric characters or an underscore.
The underscore, `_`, character is a single character wildcard to match special characters in the original match string entered by the user.
If the user enters `Dave's`, the request `"dave_s"` would match the desired entries.  
All non-alphanumeric characters in the user's match string should be replaced by underscores.

The `limit` element contains an integer that determines the maximum number of geographic locations that should appear in the places element from the server.
The client uses this value to prevent the server from sending back too much information.
The user does not specify this value and it should not appear in the user interface.
A `limit` of 0 signifies that there is no limit on the number of locations that the client can accept from the server.
If no limit is specified there is also no limit.
However, the server may have its own internal limits on the number of elements that it will return, but this should be a reasonably large value of at least 100.

The `found` element returns the total number of matching locations available in the data sources, not just the number of matching places returned.
It is independent of any limit.

The `places` element contains a list/array of objects describing the geographic locations.
Each object contains attributes describing the location that are available from the data source. 
All keys and values are strings.  
The attribute names should appear in the `placeAttributes` of the __config__ object.
The `latitude` and `longitude` elements must be specified for each place in signed decimal degrees. 

```
{
  "requestType"    : "locations",
  "requestVersion" : 3,
  "match"          : "dave",
  "limit"          : 10,
  "found"          : 1,
  "places"         : [{"name":"Dave's Airport", 
                       "latitude": "40.0332984924", 
                       "longitude": "-105.124000549",
                       "id":"0CO1",
                       "altitude":"5170",
                       "municipality":"Louisville",
                       "type":"small_airport"
                       }]
}
```

This example response searched for `"dave"` with a `limit` of ten places in the response.  
The response notes that a single response was `found` and includes the elements from the `placeAttributes` in the __config__ object.



## HTTP Status Codes

TIP supports three basic HTTP status codes in the response to the restful API request.  
The client must detect the response and report errors to the user in some manner.

* 200 means the request was successful.  
  The response body contains a JSON object with the additional information requested.
* 400 means the request was not successful due to an invalid request from the client.
  The response body will contain the original request body with no changes.
* 500 means the request was not successful due to an error that occurred while computing the result.  
  The response body will contain the original request body with no changes.


## Version History

#### Version 3 - October 06, 2019
* New version number - 3.
* New placeAttributes for places.
* New optimization level added.
* Added **locations** type.
#### Version 2 - September 15, 2019
* Added **trip** type.
* Modified **config** type to support the **trip** type.
#### Version 1 - August 26, 2019
* Initial TIP object structure for **config** and **distance** types.
* Supported HTTP status codes and responses.
