package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;


/** Defines the TIP distance object.
 *
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to determine the distance.
 * The MicroServer constructs the response JSON from the object using GSON.
 *
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to determine the distance.
 * The getDistance method is called to obtain the distance value for comparisons.
 *
 * The TIPDistance object is created to act as a proxy to the GreatCircleDistance
 * Class defind in ../misc  , and can be used for any other classes (like GCD) that
 * only use a single origin, destination, and earthRadius as inputs.
 */
public class TIPDistance extends TIPHeader {
  private Map origin;
  private Map destination;
  private Float earthRadius;
  private Integer distance;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPDistance(int version, Map origin, Map destination, float earthRadius) {
    this();
    this.requestVersion = version;
    this.origin = origin;
    this.destination = destination;
    this.earthRadius = earthRadius;
    this.distance = 100; // What gets returned
  }


  private TIPDistance() {
    this.requestType = "distance";
  }


  @Override
  public void buildResponse() {
    GreatCircleDistance distBetween = new GreatCircleDistance(origin, destination, earthRadius);
    distance = distBetween.CalculateDistance();
    log.trace("buildResponse -> {}", this);
  }


  int getDistance() { // This is where the vincenty equation should be made

    return distance;
  }

}
