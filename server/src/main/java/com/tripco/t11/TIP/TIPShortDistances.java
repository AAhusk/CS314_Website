package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import com.tripco.t11.misc.ShortestDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * The TIPShortDistance object is created to act as a proxy to the ShortestDistance
 * Class defind in ../misc  , and can be used for any other classes that take a
 * list of points,
 */
public class TIPShortDistances extends TIPHeader {
  private Map unorderedPoints;
  private List<String> orderedPoints;

  private final transient Logger log = LoggerFactory.getLogger(TIPShortDistances.class);

  TIPShortDistances(int version, Map unorderedPoints) {
    this();
    this.requestVersion = version;
    this.unorderedPoints = unorderedPoints;
    this.orderedPoints = new ArrayList<>();
  }

  private TIPShortDistances() {
    this.requestType = "shorttrip";
  }


  @Override
  public void buildResponse() {
    //ShortestDistance sd = new ShortestDistance(unorderedPoints);
    //orderedPoints = sd.nearestNeighbor();
    String mystring = unorderedPoints.get("unorderedPoints").toString();
    //log.trace(mystring, this);
    log.trace("buildResponse -> {}", this);
  }


}
