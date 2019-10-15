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
    if (options.get("optimization") != null && options.get("optimization").toString().equals("short") ) {
      this.places = this.nearestNeighborOptimization();
    }
    log.trace("buildResponse -> {}", this);
  } 

  private List<Integer> getDistances(){
    if(this.distances == null){
      return createDistances();
    }
    return this.distances;
  }

  private List<Integer> createDistances() {
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

  private int findClosestNeighbor(int[] distances, boolean[] unvisitedCities) {
    int smallest = Integer.MAX_VALUE;
    int smallestIndex = 0;
    for (int i = 0; i < distances.length; i++) {
      if (smallest > distances[i] && distances[i] != 0 && unvisitedCities[i]) {
        smallest = distances[i];
        smallestIndex = i;
      }
    }

    return smallestIndex;
  }

  private List<Map> nearestNeighborOptimization() {
    int[][] distanceMatrix = new int[this.places.size()][this.places.size()];
    double earthRadius = Double.parseDouble(options.get("earthRadius").toString());

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

    int[] bestTour = new int[this.places.size()];
    int bestDistance = Integer.MAX_VALUE;
    for (int startingCity = 0; startingCity < this.places.size(); startingCity++) {
      int[] tour = new int[this.places.size()];
      boolean[] unvisitedCities = new boolean[this.places.size()];
      int lastCity = startingCity;
      int tourindex = 1;
      int tourDistance = 0;

      Arrays.fill(unvisitedCities, true);
      unvisitedCities[startingCity] = false;
      tour[0] = startingCity;

      for (int unvisitedCitiesCount = this.places.size() - 1; unvisitedCitiesCount > 0; unvisitedCitiesCount--) {
        int smallestIndex = findClosestNeighbor(distanceMatrix[lastCity], unvisitedCities);
        tourDistance += distanceMatrix[lastCity][smallestIndex];
        tour[tourindex] = smallestIndex;
        tourindex++;
        lastCity = smallestIndex;
        unvisitedCities[smallestIndex] = false;
      }

      //System.out.println("Tour: " + Arrays.toString(tour) + "D: " + tourDistance);
      //System.out.println("Current Best: " + bestDistance);
      if (tourDistance < bestDistance) {

        bestTour = tour;
        bestDistance = tourDistance;
        //System.out.println("BTour: " + Arrays.toString(bestTour));

      }
    }

    List<Map> results = new ArrayList<>(this.places.size());

    for (int i = 0; i < this.places.size(); i++) {
      results.add(this.places.get(bestTour[i]));
    }

    return results;
    }
}


