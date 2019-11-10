package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;

import com.tripco.t11.optimizations.TwoOPT;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class TIPTrip extends TIPHeader {
  private Map options;
  private List<Map> places;
  private List<Integer> distances;
  private Double earthRadius;

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
    if (options.get("optimization") == null || options.get("optimization").toString().equals("none")) {
      this.distances = this.createDistances();
    }
    else if (options.get("optimization") != null && options.get("optimization").toString().equals("short") ) {
      int[][] distancesTable = this.createDistTable(this.places.size());
      int[] tourSequence = this.nearestNeighborOptimization(distancesTable);
      this.places = this.getItinerary(tourSequence);
    }
    else if (options.get("optimization").toString().equals("shorter")) {
      int[][] distancesTable = this.createDistTable(this.places.size()+1);
      int[] nearestRoute = this.nearestNeighborOptimization(distancesTable);
      TwoOPT shorterRoute = new TwoOPT(nearestRoute, distancesTable);
      int[] tourSequence = shorterRoute.shorterRoute();
      this.places = this.getItinerary(tourSequence);
    }
    log.trace("buildResponse -> {}", this);
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

  private int[][] createDistTable(int tableSize) {
    int[][] distanceMatrix = new int[tableSize][tableSize];
    this.earthRadius = Double.parseDouble(options.get("earthRadius").toString());

    for (int i = 0; i < this.places.size(); i++) {
      distanceMatrix[i][i] = 0;
      for (int j = i+1; j < this.places.size(); j++) {
        GreatCircleDistance distBetween = new GreatCircleDistance(places.get(i), places.get(j), this.earthRadius);

        int distance = distBetween.CalculateDistance();
        distanceMatrix[i][j] = distance;
        distanceMatrix[j][i] = distance;
      }
    }
    if(tableSize == this.places.size()+1) {
      for (int i=1; i<this.places.size(); ++i) {
        distanceMatrix[i][tableSize-1] = distanceMatrix[i][0];
      }
      int[] startLocation = distanceMatrix[0];
      distanceMatrix[tableSize-1] = startLocation;
    }

    return distanceMatrix;
  }

  private int findClosestNeighbor(int[] distances, boolean[] unvisitedCities) {
    int smallest = Integer.MAX_VALUE;
    int smallestIndex = 0;
    for (int i = 0; i < this.places.size(); i++) {
      if (smallest > distances[i] && distances[i] != 0 && unvisitedCities[i]) {
        smallest = distances[i];
        smallestIndex = i;
      }
    }

    return smallestIndex;
  }

  private int[] nearestNeighborOptimization(int[][] distanceMatrix) {

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

      if (tourDistance < bestDistance) {
        bestTour = tour;
        bestDistance = tourDistance;
      }
    }
      return bestTour;
    }

    private List<Map> getItinerary(int[] tourSequence) {
      List<Map> results = new ArrayList<>(this.places.size());
      for (int i = 0; i < this.places.size(); i++) {
        results.add(this.places.get(tourSequence[i]));
      }
      return results;
    }
}


