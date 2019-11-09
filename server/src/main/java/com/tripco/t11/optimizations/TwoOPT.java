package com.tripco.t11.optimizations;

import com.tripco.t11.misc.GreatCircleDistance;


import java.util.List;
import java.util.Map;


public class TwoOPT {


  private List<Map> shorterRoute;
  private List<Integer> distances;
  private double earthRadius;

  private long distOneToTwo;
  private long distThreeToFour;
  private long distOneToThree;
  private long distTwoToFour;


  public TwoOPT(List<Map> places, List<Integer> distances, double earthRadius) {
    this.shorterRoute = places;
    this.distances = distances;
    this.earthRadius = earthRadius;
  }

  public List<Map> shorterRoute() {
    Map start = shorterRoute.get(0);
    shorterRoute.add(start);
    int lastPlaceIndex = shorterRoute.size() - 1;
    this.findImprovements(lastPlaceIndex);
    shorterRoute.remove(lastPlaceIndex);
    return this.shorterRoute;
  }

  /*public List<Integer> getDistances() {
    return this.distances;
  }*/

  private void findImprovements(int lastPlaceIndex){
    boolean improvement = true;
    while (improvement) {
      improvement = false;
      for (int i = 0; i <= lastPlaceIndex-3; ++i) {
        for (int k = i+2; k <= lastPlaceIndex-1; ++k) {
          this.fourDistances(i, k);
          long delta = (-distOneToTwo - distThreeToFour) + (distOneToThree + distTwoToFour);
          if(delta < 0) {
            reverse(i+1, k);
            improvement = true;
          }
        }
      }
    }
  }

  private void reverse(int i1, int k) {
    while (i1<k) {
      Map placeI = this.shorterRoute.get(i1);
      this.shorterRoute.set(i1, this.shorterRoute.get(k));
      this.shorterRoute.set(k, placeI);
      ++i1; --k;
    }
  }

  private void fourDistances(int i, int k) {
    GreatCircleDistance oneToTwo =
        new GreatCircleDistance(shorterRoute.get(i), shorterRoute.get(i+1), this.earthRadius);
    GreatCircleDistance threeToFour =
        new GreatCircleDistance(shorterRoute.get(k), shorterRoute.get(k+1), this.earthRadius);
    GreatCircleDistance oneToThree =
        new GreatCircleDistance(shorterRoute.get(i), shorterRoute.get(k), this.earthRadius);
    GreatCircleDistance twoToFour =
        new GreatCircleDistance(shorterRoute.get(i+1), shorterRoute.get(k+1), this.earthRadius);
    this.distOneToTwo = oneToTwo.CalculateDistance(); this.distThreeToFour = threeToFour.CalculateDistance();
    this.distOneToThree = oneToThree.CalculateDistance(); this.distTwoToFour = twoToFour.CalculateDistance();
  }
}
