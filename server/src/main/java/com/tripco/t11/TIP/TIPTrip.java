package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Arrays;
import java.util.List;


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
    log.trace("buildResponse -> {}", this);
  } 

  
  List<Integer> getDistances(){

    if(this.distances == null){
      return Arrays.asList(1 , 2, 3);
    }

    return this.distances;
  }

}
