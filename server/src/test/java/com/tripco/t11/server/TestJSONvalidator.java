package com.tripco.t11.server;

import java.io.InputStream;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TestJSONvalidator {

  private final Logger log = LoggerFactory.getLogger(MicroServer.class);
  private final String TripSchema = "/TIPTripRequestSchema.json";
  private final String Valid_Trip_brew = "{\n"
      + "  \"requestType\"    : \"trip\",\n"
      + "  \"requestVersion\" : 2,\n"
      + "  \"options\"        : {\n"
      + "    \"title\":\"My Trip\",\n"
      + "    \"earthRadius\":\"3958.8\",\n"
      + "    \"optimization\":\"none\"\n"
      + "  },\n"
      + "  \"places\"         : [   {\"id\": \"lcapasso\", \"name\": \"Spice Trade Brewing\", \"municipality\": \"Arvada\", \"latitude\": \"39.802332\", \"longitude\": \"-105.079015\", \"altitude\": \"5347\"}\n"
      + "  ,{\"id\": \"tblick\", \"name\": \"Aspen Brewing Company\", \"municipality\": \"Aspen\", \"latitude\": \"39.19\", \"longitude\": \"-106.82\", \"altitude\": \"7854\"}\n"
      + "  ,{\"id\": \"eknether\", \"name\": \"Peak to Peak Tap & Brew\", \"municipality\": \"Aurora\", \"latitude\": \"39.67\", \"longitude\": \"-104.79\", \"altitude\": \"5547\"}\n"
      + "  ,{\"id\": \"jgriego\", \"name\": \"Avery Brewing Company\", \"municipality\":\"Boulder\", \"latitude\": \"40.03\", \"longitude\": \"-105.12\", \"altitude\": \"5197\"}\n"
      + "  ,{\"id\": \"pjcaracc\",\"name\": \"Boulder Beer Company\", \"municipality\": \"Boulder\", \"latitude\": \"40.03\", \"longitude\": \"-105.25\", \"altitude\":\"5270\"}\n"
      + "  ,{\"id\": \"tnairn99\", \"name\": \"Twisted Pine Brewing Company\", \"municipality\": \"Boulder\", \"latitude\": \"40.0206\", \"longitude\": \"-105.2508\", \"altitude\": \"5285\"}\n"
      + "  ,{\"id\": \"schwamal\", \"name\": \"Upslope Brewing Company\", \"municipality\": \"Boulder\", \"latitude\": \"40.020197\", \"longitude\": \"-105.218347\", \"altitude\": \"5223\"}\n"
      + "  ,{\"id\": \"feiran\", \"name\": \"Walnutbrewery\", \"municipality\": \"Boulder\", \"latitude\": \"40.0169\", \"longitude\": \"-105.2803\", \"altitude\": \"1990\"}\n"
      + "  ,{\"id\": \"cube\", \"name\": \"wild woods brewery\", \"municipality\": \"Boulder\", \"latitude\": \"40.01\", \"longitude\": \"-105.13\", \"altitude\": \"5219\"}\n"
      + "  ]\n"
      + "}";
  private final String Invalid_Trip_brew = "{\n"
      + "  \"requestType\"    : \"trip\",\n"
      + "  \"options\"        : {\n"
      + "    \"title\":\"My Trip\",\n"
      + "    \"earthRadius\":\"3958.8\",\n"
      + "    \"optimization\":\"none\"\n"
      + "  },\n"
      + "  \"places\"         : [   {\"id\": \"lcapasso\", \"name\": \"Spice Trade Brewing\", \"municipality\": \"Arvada\", \"latitude\": \"39.802332\", \"longitude\": \"-105.079015\", \"altitude\": \"5347\"}\n"
      + "  ,{\"id\": \"tblick\", \"name\": \"Aspen Brewing Company\", \"municipality\": \"Aspen\", \"latitude\": \"39.19\", \"longitude\": \"-106.82\", \"altitude\": \"7854\"}\n"
      + "  ,{\"id\": \"eknether\", \"name\": \"Peak to Peak Tap & Brew\", \"municipality\": \"Aurora\", \"latitude\": \"39.67\", \"longitude\": \"-104.79\", \"altitude\": \"5547\"}\n"
      + "  ,{\"id\": \"jgriego\", \"name\": \"Avery Brewing Company\", \"municipality\":\"Boulder\", \"latitude\": \"40.03\", \"longitude\": \"-105.12\", \"altitude\": \"5197\"}\n"
      + "  ,{\"id\": \"pjcaracc\",\"name\": \"Boulder Beer Company\", \"municipality\": \"Boulder\", \"latitude\": \"40.03\", \"longitude\": \"-105.25\", \"altitude\":\"5270\"}\n"
      + "  ,{\"id\": \"tnairn99\", \"name\": \"Twisted Pine Brewing Company\", \"municipality\": \"Boulder\", \"latitude\": \"40.0206\", \"longitude\": \"-105.2508\", \"altitude\": \"5285\"}\n"
      + "  ,{\"id\": \"schwamal\", \"name\": \"Upslope Brewing Company\", \"municipality\": \"Boulder\", \"latitude\": \"40.020197\", \"longitude\": \"-105.218347\", \"altitude\": \"5223\"}\n"
      + "  ,{\"id\": \"feiran\", \"name\": \"Walnutbrewery\", \"municipality\": \"Boulder\", \"latitude\": \"40.0169\", \"longitude\": \"-105.2803\", \"altitude\": \"1990\"}\n"
      + "  ,{\"id\": \"cube\", \"name\": \"wild woods brewery\", \"municipality\": \"Boulder\", \"latitude\": \"40.01\", \"longitude\": \"-105.13\", \"altitude\": \"5219\"}\n"
      + "  ]\n"
      + "}";

  @Test
  public void testValidTIPTripJSON() {
    JSONObject JSONSchema = null;
    InputStream JSONinputStream = getClass().getResourceAsStream(TripSchema);
    JSONSchema = new JSONObject(new JSONTokener(JSONinputStream));
    Boolean validJSON = MicroServer.performValidation(Valid_Trip_brew, JSONSchema);
    assertTrue(validJSON);
    return;
  }

  @Test
  public void testInvalidTIPTripJSON() {
    JSONObject JSONSchema = null;
    InputStream JSONinputStream = getClass().getResourceAsStream(TripSchema);
    JSONSchema = new JSONObject(new JSONTokener(JSONinputStream));
    Boolean validJSON = MicroServer.performValidation(Invalid_Trip_brew, JSONSchema);
    assertFalse(validJSON);
    return;
  }
}
