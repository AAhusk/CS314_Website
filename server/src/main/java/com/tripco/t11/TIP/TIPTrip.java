package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
// import static java.util.System;


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
 */
public class TIPTrip extends TIPHeader {
  private Integer requestVersion;
  private Map options;
  private Map[] places;
  private Integer[] distances;

  private final transient Logger log = LoggerFactory.getLogger(TIPTrip.class);


  TIPTrip(int version, Map options, Map[] places, Integer[] distances) {
    this();
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
    log.trace("buildResponse -> {}", this);
  }

}
