package com.tripco.t11.misc;

import java.lang.Math;
import java.util.Map;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance {
  double EarthRadius;
  double LatStart; //These lats and longs will be in radians
  double LongStart;
  double LatEnd;
  double LongEnd;
  final double Pi = Math.PI;

  public GreatCircleDistance(Map origin, Map destination, double EarthRadius) {
    double LatStartInDegrees = Double.parseDouble(origin.get("latitude").toString());
    double LongStartInDegrees = Double.parseDouble(origin.get("longitude").toString());
    double LatEndInDegrees = Double.parseDouble(destination.get("latitude").toString());
    double LongEndInDegrees = Double.parseDouble(destination.get("longitude").toString());

    LatStart = Math.toRadians(LatStartInDegrees);
    LongStart = Math.toRadians(LongStartInDegrees);
    LatEnd = Math.toRadians(LatEndInDegrees);
    LongEnd = Math.toRadians(LongEndInDegrees);

    this.EarthRadius = EarthRadius;
  }

  public int CalculateDistance() {
    double centralAngleInRadians = calcCentralAngle();

    double distance = centralAngleInRadians * EarthRadius;
    return Math.abs((int) Math.round(distance));
  }

  private double calcCentralAngle() {
    double numerator = calcVincentyNumerator();
    double denominator = calcVincentyDenominator();

    return Math.atan2(numerator, denominator);
  }
  private double calcVincentyNumerator() {
    double LongAbsDifference = Math.abs(LongEnd-LongStart);
    double innerRightSummand = Math.sin(LatStart) * Math.cos(LatEnd) * Math.cos(LongAbsDifference);
    double RightSummand = Math.pow((Math.cos(LatStart)*Math.sin(LatEnd) - innerRightSummand), 2);

    double innerLeftSummand = Math.cos(LatEnd) * Math.sin(LongAbsDifference);
    double LeftSummand = Math.pow(innerLeftSummand, 2);
    return Math.sqrt(RightSummand + LeftSummand);
  }
  private double calcVincentyDenominator() {
    double LongAbsDifference = Math.abs(LongEnd-LongStart);
    double LeftSummand = Math.sin(LatStart) * Math.sin(LatEnd);
    double RightSummand = Math.cos(LatStart) * Math.cos(LatEnd) * Math.cos(LongAbsDifference);
    return LeftSummand + RightSummand;
  }
}
