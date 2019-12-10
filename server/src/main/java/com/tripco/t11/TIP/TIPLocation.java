// Code used in this file for the database is credited to Dave Matthews on Github under TripCo/guides/database/DatabaseGuide.md
package com.tripco.t11.TIP;

import com.tripco.t11.misc.Place;
import java.sql.*;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Created by Dave Matthews in TripCo/guides/database/DatabaseGuide.md
public class TIPLocation extends TIPHeader {
  private String match;     // Client & Server
  private Map<String, List<String>> narrow;
  private int limit;        // Optional in client, provided in server iff in client
  private int found;        // Server only
  private List<Place> places; // Server only

  private final transient Logger log = LoggerFactory.getLogger(TIPLocation.class);


  TIPLocation(int version, String match, Map<String, List<String>> narrow, int limit, int found, List<Place> places) {
    this.requestVersion = version;
    this.match = match;
    this.narrow = narrow;
    this.limit = limit;
    this.found = found;
    this.places = places;
    //this.narrow = narrow;
  }

  private TIPLocation() {
    this.requestType = "location";
  }


  // Created by Dave Matthews on GitHub in TripCo/guides/database/DatabaseGuide.md
  // db configuration information
  //private final static String myDriver = "com.mysql.jdbc.Driver";
  private static String myUrl = "";
  private static String user = "";
  private static String pass = "";

  // fill in SQL queries to count the number of records and to retrieve the data
  private final static String count = "";


  // Created by Dave Matthews in TripCo/guides/database/DatabaseGuide.md
  @Override
  public void buildResponse() {
    // Get correct URL, username, and password
    String isTravis = System.getenv("TRAVIS");
    String isDevelopment = System.getenv("CS314_ENV");
    if(isTravis != null && isTravis.equals("true")) {
      myUrl = "jdbc:mysql://127.0.0.1:56247/cs314";
      user = "root";
      pass = null;
    }
    else if(isDevelopment != null && isDevelopment.equals("development")) {
      myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
      user = "cs314-db";
      pass = "eiK5liet1uej";
    }
    else {
      myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
      user = "cs314-db";
      pass = "eiK5liet1uej";
    }

    // Query Database
    try {
      log.trace("---------------Attempting to Reach Database---------------");
      Class.forName("com.mysql.jdbc.Driver");
      
      String matchNew = this.match.replaceAll("'", "_");
      matchNew = matchNew.replaceAll("-", "_");

      String m = "'%" + matchNew + "%'";

      String query = "SELECT world.name, world.municipality, region.name, country.name, continent.name, world.latitude, world.longitude, world.altitude, world.id FROM continent " +
                     "INNER JOIN country on continent.id = country.continent " +
                     "INNER JOIN region on country.id = region.iso_country " +
                     "INNER JOIN world on region.id = world.iso_region " +
                     "WHERE (country.name LIKE " + m +
                     " OR region.name LIKE " + m +
                     " OR world.name LIKE " + m +
                     " OR world.municipality LIKE " + m +
                     " OR continent.name LIKE " + m +
                     " OR world.id LIKE " + m + ")";
        for (Map.Entry<String, List<String>> entry : narrow.entrySet()) {
          String key = entry.getKey();
          List<String> values = entry.getValue();

          switch (key) {
            case "type":
              for (String val : values) {
                query += " AND world.type LIKE '%" + val + "%'";
              }
              break;
            case "country":
              for (String val : values) {
                query += " AND country.name LIKE '%" + val + "%'";
              }
              break;
            case "region":
              for (String val : values) {
                query += " AND region.name LIKE '%" + val + "%'";
              }
              break;
            case "municipality":
              for (String val : values) {
                query += " AND world.municipality LIKE '%" + val + "%'";
              }
              break;
            case "name":
              for (String val : values) {
                query += " AND world.name LIKE '%" + val + "%'";
              }
              break;
            case "continent":
              for (String val : values) {
                query += " AND continent.name LIKE '%" + val + "%'";
              }
              break;
            case "id":
              for (String val : values) {
                query += " AND world.id LIKE '%" + val + "%'";
              }
              break;
            default:
              break;
          }
        }
      query += " ORDER BY continent.name, country.name, region.name, world.municipality, world.name ASC";

      if(limit == 27) {
        query += " LIMIT 27";
      }
      try (Connection conn = DriverManager.getConnection(myUrl, user, pass);
           Statement stCount = conn.createStatement();
           Statement stQuery = conn.createStatement();
           //ResultSet rsCount = stCount.executeQuery(String.valueOf(this.limit));
           ResultSet rsQuery = stQuery.executeQuery(query);
      ) {
        log.trace("RESULTS " + rsQuery);
        while(rsQuery.next()) {
          this.found++;
          if(this.found <= this.limit) {
              Place p = new Place(rsQuery.getString("world.name"), rsQuery.getString("world.latitude"),
                      rsQuery.getString("world.longitude"), rsQuery.getString("world.id"),
                      rsQuery.getString("world.municipality"), rsQuery.getString("world.altitude"),
                      rsQuery.getString("region.name"), rsQuery.getString("country.name"),
                      rsQuery.getString("continent.name"));
              places.add(p);
          }
        }
      }
      log.trace("---------------Finished---------------");
    } catch(Exception e) {
        System.err.println("Exception: "+e.getMessage());
    }
    log.trace("buildResponse -> {}", this);
  }
}

