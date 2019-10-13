package com.tripco.t11.misc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ShortestDistance {

  List<LatLong> latLongs = new ArrayList<LatLong>();
  Map places;

  public ShortestDistance(Map places) {
    this.places = places;
  }

  public LatLong nearestNeighbor() {
    List<LatLong> results = new ArrayList<>(); // Final sorted points
    return results;
  }

}
