package com.tripco.t11.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP distance class and its buildResponse method.
 */
public class TestTIPDistance {

  /* Radius and location values shared by test cases */
  private final float radiusMiles = 3959;
  private final float radiusKilometers = 6371;
  private final float radiusNauticalMiles = 3440;
  private Map<String, Object> csu;
  private Map<String, Object> Q1;
  private Map<String, Object> Q2;
  private Map<String, Object> Q3;
  private Map<String, Object> Q4;
  private Map<String, Object> OutOfBoundsLongitude;
  private Map<String, Object> NegOutOfBoundsLongitude;
  private final int version = 1;

  @Before
  public void createLocationsForTestCases() {
    csu = new HashMap<>();
    csu.put("latitude", "40.576179");
    csu.put("longitude", "-105.080773");
    csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");
    Q1 = new HashMap<>();
    Q1.put("latitude", "30.6");
    Q1.put("longitude", "20.4");
    Q2 = new HashMap<>();
    Q2.put("latitude", "-40.6");
    Q2.put("longitude", "20.4");
    Q3 = new HashMap<>();
    Q3.put("latitude", "-50.6");
    Q3.put("longitude", "-20.4");
    Q4 = new HashMap<>();
    Q4.put("latitude", "60.6");
    Q4.put("longitude", "-20.4");
    OutOfBoundsLongitude = new HashMap<>();
    OutOfBoundsLongitude.put("latitude", "30.6");
    OutOfBoundsLongitude.put("longitude", "380.4");
    NegOutOfBoundsLongitude = new HashMap<>();
    NegOutOfBoundsLongitude.put("latitude", "30.6");
    NegOutOfBoundsLongitude.put("longitude", "-339.6");

  }

  @Test
  public void testOriginDestinationSame() {
    TIPDistance trip = new TIPDistance(version, csu, csu, radiusMiles);
    trip.buildResponse();
    int expect = 0;
    int actual = trip.getDistance();
    assertEquals("origin and destination are the same", expect, actual);
  }
  @Test
  public void testQ1toQ2() {
    TIPDistance trip = new TIPDistance(version, Q1, Q2, radiusMiles);
    trip.buildResponse();
    int expect = 4920;
    int actual = trip.getDistance();
    assertEquals("Q1 to Q2 equals 4920", expect, actual);
  }
  @Test
  public void testQ1toQ3() {
    TIPDistance trip = new TIPDistance(version, Q1, Q3, radiusMiles);
    trip.buildResponse();
    int expect = 6139;
    int actual = trip.getDistance();
    assertEquals("Q1 to Q3 equals 6139", expect, actual);
  }
  @Test
  public void testQ1toQ4() {
    TIPDistance trip = new TIPDistance(version, Q1, Q4, radiusMiles);
    trip.buildResponse();
    int expect = 2780;
    int actual = trip.getDistance();
    assertEquals("Q1 to Q4 equals 2780", expect, actual);
  }
  @Test
  public void testQ2toQ3() {
    TIPDistance trip = new TIPDistance(version, Q2, Q3, radiusMiles);
    trip.buildResponse();
    int expect = 2060;
    int actual = trip.getDistance();
    assertEquals("Q2 to Q3 equals 2060", expect, actual);
  }
  @Test
  public void testQ2toQ4() {
    TIPDistance trip = new TIPDistance(version, Q2, Q4, radiusMiles);
    trip.buildResponse();
    int expect = 7362;
    int actual = trip.getDistance();
    assertEquals("Q2 to Q4 equals 7362", expect, actual);
  }
  @Test
  public void testQ3toQ4() {
    TIPDistance trip = new TIPDistance(version, Q3, Q4, radiusMiles);
    trip.buildResponse();
    int expect = 7684;
    int actual = trip.getDistance();
    assertEquals("Q2 to Q4 equals 7684", expect, actual);
  }
  @Test
  public void testOutOfBoundsLongitude() {
    TIPDistance trip = new TIPDistance(version, Q1, OutOfBoundsLongitude, radiusMiles);
    trip.buildResponse();
    int expect = 0;
    int actual = trip.getDistance();
    assertEquals("380.4 Degrees Longitude equals 20.4 Degrees", expect, actual);
  }
  @Test
  public void testNegOutOfBoundsLongitude() {
    TIPDistance trip = new TIPDistance(version, Q1, NegOutOfBoundsLongitude, radiusMiles);
    trip.buildResponse();
    int expect = 0;
    int actual = trip.getDistance();
    assertEquals("-339.6 Degrees Longitude equals 20.4 Degrees", expect, actual);
  }
  @Test
  public void testKilometersAsEarthRadius() {
    TIPDistance trip = new TIPDistance(version, Q1, Q2, radiusKilometers);
    trip.buildResponse();
    int expect = 7917;
    int actual = trip.getDistance();
    assertEquals("Q1 to Q2 equals 7917 Kilometers", expect, actual);
  }
  @Test
  public void testNauticalMilesAsEarthRadius() {
    TIPDistance trip = new TIPDistance(version, Q1, Q2, radiusNauticalMiles);
    trip.buildResponse();
    int expect = 4275;
    int actual = trip.getDistance();
    assertEquals("Q1 to Q2 equals 4275 Nautical Miles", expect, actual);
  }
}
