package com.tripco.t11.optimizations;

public class TwoOPT {

  private long[][] distTable;
  private int[] shorterRoute;


  public TwoOPT(int[] nearestRoute, long[][] distTable) {
    createRouteArray(nearestRoute);
    this.distTable = distTable;
  }

  public int[] shorterRoute() {
    int lastPlaceIndex = this.shorterRoute.length-1;
    this.findImprovements(lastPlaceIndex);
    return this.shorterRoute;
  }

  private void createRouteArray(int[] nearestRoute) {
    this.shorterRoute = new int[nearestRoute.length+1];
    for (int i=0; i<nearestRoute.length; ++i) {
      this.shorterRoute[i] = nearestRoute[i];
    }
    this.shorterRoute[this.shorterRoute.length-1] = nearestRoute[0];

  }


  private void findImprovements(int lastPlaceIndex){
    boolean improvement = true;
    while (improvement) {
      improvement = false;
      for (int i = 0; i <= lastPlaceIndex-3; ++i) {
        for (int k = i+2; k <= lastPlaceIndex-1; ++k) {
          long distOneToTwo = this.distTable[shorterRoute[i]][shorterRoute[i+1]];
          long distThreeToFour = this.distTable[shorterRoute[k]][shorterRoute[k+1]];
          long distOneToThree = this.distTable[shorterRoute[i]][shorterRoute[k]];
          long distTwoToFour = this.distTable[shorterRoute[i+1]][shorterRoute[k+1]];
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
      int placeI = this.shorterRoute[i1];
      this.shorterRoute[i1] = this.shorterRoute[k];
      this.shorterRoute[k] = placeI;
      ++i1; --k;
    }
  }

}
