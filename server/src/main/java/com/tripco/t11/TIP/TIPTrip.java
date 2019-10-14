package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Arrays;



public class TIPTrip extends TIPHeader {
  private Map options;
  private List<Map> places;
  private List<Integer> distances;

  private final transient Logger log = LoggerFactory.getLogger(TIPTrip.class);


  TIPTrip(int version, Map options, List<Map> places, List<Integer> distances) {
    this.requestVersion = version;
    this.options = options;
    this.places = places;
    this.distances = distances;
  }

  private TIPTrip() {
    this.requestType = "trip";
  }


  @Override
  public void buildResponse() {
    this.distances = this.getDistances();
    if (options.get("optimization").toString().equals("short") ) {
      this.places = this.nearestNeighborOptimization();
    }
    log.trace("buildResponse -> {}", this);
  } 

  List<Integer> getDistances(){
    if(this.distances == null){
      return createDistances();
    }
    return this.distances;
  }

  List<Integer> createDistances() {
    Integer[] distances = new Integer[this.places.size()];
    double earthRadius = Double.parseDouble(options.get("earthRadius").toString());
    int lastIndex = places.size() - 1;

    for( int i=0; i<lastIndex; i++ ){
      GreatCircleDistance distBetween = new GreatCircleDistance(places.get(i), places.get(i+1), earthRadius);
      distances[i]= distBetween.CalculateDistance();
    }

    GreatCircleDistance distBetween = new GreatCircleDistance(places.get(lastIndex), places.get(0), earthRadius);
    distances[lastIndex]= distBetween.CalculateDistance();

    return Arrays.asList(distances);
  }

  List<Map> nearestNeighborOptimization() {
    Integer[] tour = new Integer[this.places.size()];
    boolean[] unvisitedCities = new boolean[this.places.size()-1];
    Integer[][] distanceMatrix = new Integer[this.places.size()][this.places.size()];
    double earthRadius = Double.parseDouble(options.get("earthRadius").toString());

    tour[0] = 0;
    unvisitedCities[0] = true;

    // Set up the distance matrix
    for (int i = 0; i < this.places.size(); i++) {
      distanceMatrix[i][i] = 0;
      for (int j = i+1; j < this.places.size(); j++) {
        // Hopefully garbage collection does its job!
        GreatCircleDistance distBetween = new GreatCircleDistance(places.get(i), places.get(j), earthRadius);

        int distance = distBetween.CalculateDistance();
        distanceMatrix[i][j] = distance;
        distanceMatrix[j][i] = distance;
      }
    }

    for (int i = 0; i < this.places.size(); i++) {

    }

    /*
    nearestNeighbor(cities) {
      for each starting city
        add the starting city to the tour and remove from the list of unvisited cities
           while there are unvisited cities remaining
           from the last city in the tour add the nearest unvisited city to the tour
      return the tour with the shortest round trip distance

     */
    return null;
    }
}


