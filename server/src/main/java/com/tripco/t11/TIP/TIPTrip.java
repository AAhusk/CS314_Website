package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


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
      return createDistances();
    }

    return this.distances;
  }

  List<Integer> createDistances(){
    Integer[] distances = new Integer[this.places.size()];
    float earthRadius = Float.parseFloat(options.get("earthRadius").toString());
    int lastIndex = places.size() - 1;

    for( int i=0; i<lastIndex; i++ ){
      GreatCircleDistance distBetween = new GreatCircleDistance(places.get(i), places.get(i+1), earthRadius);
      distances[i]= distBetween.CalculateDistance();
    }

    GreatCircleDistance distBetween = new GreatCircleDistance(places.get(lastIndex), places.get(0), earthRadius);
    distances[lastIndex]= distBetween.CalculateDistance();

    return Arrays.asList(distances);
  }

}
