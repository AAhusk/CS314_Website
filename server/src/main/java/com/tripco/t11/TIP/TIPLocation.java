package com.tripco.t11.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.Map;


public class TIPLocation extends TIPHeader {

  private String match;     // Client & Server
  private int limit;        // Optional in client, provided in server iff in client
  private int found;        // Server only
  private List<Map> places; // Server only

  private final transient Logger log = LoggerFactory.getLogger(TIPLocation.class);

  TIPLocation(int version, String match, int limit, int found, List<Map> places) {
    this.requestVersion = version;
    this.match = match;
    this.limit = limit;
    this.found = found;
    this.places = places;
  }

  private TIPLocation() {
    this.requestType = "location";
  }

  @Override
  public void buildResponse() {
    log.trace("buildResponse -> {}", this);
  }
}
