package com.tripco.t11.server;

import com.google.gson.Gson;

import com.tripco.t11.TIP.TIPConfig;
import com.tripco.t11.TIP.TIPDistance;
import com.tripco.t11.TIP.TIPHeader;
import com.tripco.t11.TIP.TIPTrip;
import com.tripco.t11.TIP.TIPLocation;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;
import java.util.Scanner;
import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.everit.json.schema.SchemaException;
import org.everit.json.schema.Validator;
import org.json.JSONTokener;

import java.lang.reflect.Type;
import java.io.InputStream;
import java.lang.String;
import java.io.File;

import spark.Request;
import spark.Response;
import spark.Spark;
import static spark.Spark.secure;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/** A micro server for a single page web application that serves the static files
 * and processes restful API requests.
 */
class MicroServer {

  private static final Logger log = LoggerFactory.getLogger(MicroServer.class);


  MicroServer(int serverPort) {
    configureServer(serverPort);
    serveStaticPages();
    processRestfulAPIrequests();
    log.info("MicroServer running on port: {}", serverPort);
  }


  private void configureServer(int serverPort) {
    Spark.port(serverPort);
    String keystoreFile = System.getenv("KEYSTORE_FILE");
    String keystorePassword = System.getenv("KEYSTORE_PASSWORD");
    if (keystoreFile != null && keystorePassword != null) {
      secure(keystoreFile, keystorePassword, null, null);
      log.info("Keystore file: {}", keystoreFile);
      log.info("Keystore password: {}", keystorePassword);
      log.info("MicroServer using HTTPS.");
    }
    else {
      log.info("MicroServer using HTTP.");
    }
    log.trace("Server configuration complete");
  }


  private void serveStaticPages() {
    String path = "/public/";
    Spark.staticFileLocation(path);
    Spark.get("/", (req, res) -> { res.redirect("index.html"); return null; });
    log.trace("Static file configuration complete");
  }


  private void processRestfulAPIrequests() {
    Spark.get("/api/config", this::processTIPconfigRequest);
    Spark.post("/api/distance", this::processTIPdistanceRequest);
    Spark.post("/api/trip", this::processTIPtripRequest);
    Spark.get("/api/echo", this::echoHTTPrequest);
    Spark.post("/api/location", this::processTIPLocationRequest);
    
    log.trace("Restful configuration complete");
  }


  private String processTIPconfigRequest(Request request, Response response) {
    log.info("TIP Config request: {}", HTTPrequestToJson(request));
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.status(200);
    try {
      Gson jsonConverter = new Gson();
      TIPConfig tipRequest = new TIPConfig();
      tipRequest.buildResponse();
      String responseBody = jsonConverter.toJson(tipRequest);
      log.trace("TIP Config response: {}", responseBody);
      return responseBody;
    } catch (Exception e) {
      log.error("Exception: {}", e);
      response.status(500);
      return request.body();
    }
  }


  private String processTIPLocationRequest(Request request, Response response) {
    JSONObject LocationSchema = getSchema("/TIPLocationsRequestSchema.json");
    performValidation(request.body(), LocationSchema);
    return processTIPrequest(TIPLocation.class, request, response);
  }


  private String processTIPdistanceRequest(Request request, Response response) {
    JSONObject DistanceSchema = getSchema("/TIPDistanceRequestSchema.json");
    performValidation(request.body(), DistanceSchema);
    return processTIPrequest(TIPDistance.class, request, response);
  }

  private String processTIPtripRequest(Request request, Response response) {
    JSONObject TripSchema = getSchema("/TIPTripRequestSchema.json");
    performValidation(request.body(), TripSchema);
    return processTIPrequest(TIPTrip.class, request, response);
  }

  private JSONObject getSchema(String SchemaFilePath) {
    JSONObject JSONSchema = null;
    try {
      InputStream JSONinputStream = getClass().getResourceAsStream(SchemaFilePath);
      JSONSchema = new JSONObject(new JSONTokener(JSONinputStream));
    }
    catch (Exception e) {
      log.error("Error retrieving schema file from resources!");
    }
    return JSONSchema;
  }

  public static boolean performValidation(String TripRequest, JSONObject JSONSchema) {
    boolean validationResult = true;
    JSONObject JSONrequest = null;
    try {
      JSONrequest = new JSONObject(TripRequest);
      log.info("This should be the JSONrequestBody: {}", JSONrequest);
    }
    catch (Exception e) {
      log.error("Couldn't create JSON object from request body");
      validationResult = false;
    }
    try {
      Schema schema = SchemaLoader.load(JSONSchema);
      log.info("This should be the JSON schema: {}", JSONSchema);
      // This is the line that will throw a ValidationException if anything doesn't conform to the schema!
      schema.validate(JSONrequest);
    }
    catch (SchemaException e) {
      log.error("Caught a schema exception!");
      e.printStackTrace();
      validationResult = false;
    }
    catch (ValidationException e) {
      log.error("Caught validation exception when validating schema! Root message: {}", e.getErrorMessage());
      log.error("All messages from errors (including nested):");
      // For now, messages are probably just good for debugging, to see why something failed
      List<String> allMessages = e.getAllMessages();
      for (String message : allMessages) {
        log.error(message);
      }
      validationResult = false;
    }

    finally {
      log.info("VALIDATION: {}", validationResult);
      return validationResult;
    }
  }

  private String processTIPrequest(Type tipType, Request request, Response response) {
    log.info("TIP Request: {}", HTTPrequestToJson(request));
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.status(200);
    try {
      Gson jsonConverter = new Gson();
      TIPHeader tipRequest = jsonConverter.fromJson(request.body(), tipType);
      tipRequest.buildResponse();
      String responseBody = jsonConverter.toJson(tipRequest);
      log.trace("TIP Response: {}", responseBody);
      return responseBody;
    } catch (Exception e) {
      log.error("Exception: {}", e);
      response.status(500);
      return request.body();
    }
  }


  private String echoHTTPrequest(Request request, Response response) {
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    return HTTPrequestToJson(request);
  }


  private String HTTPrequestToJson(Request request) {
    return "{\n"
        + "\"attributes\":\"" + request.attributes() + "\",\n"
        + "\"body\":\"" + request.body() + "\",\n"
        + "\"contentLength\":\"" + request.contentLength() + "\",\n"
        + "\"contentType\":\"" + request.contentType() + "\",\n"
        + "\"contextPath\":\"" + request.contextPath() + "\",\n"
        + "\"cookies\":\"" + request.cookies() + "\",\n"
        + "\"headers\":\"" + request.headers() + "\",\n"
        + "\"host\":\"" + request.host() + "\",\n"
        + "\"ip\":\"" + request.ip() + "\",\n"
        + "\"params\":\"" + request.params() + "\",\n"
        + "\"pathInfo\":\"" + request.pathInfo() + "\",\n"
        + "\"serverPort\":\"" + request.port() + "\",\n"
        + "\"protocol\":\"" + request.protocol() + "\",\n"
        + "\"queryParams\":\"" + request.queryParams() + "\",\n"
        + "\"requestMethod\":\"" + request.requestMethod() + "\",\n"
        + "\"scheme\":\"" + request.scheme() + "\",\n"
        + "\"servletPath\":\"" + request.servletPath() + "\",\n"
        + "\"session\":\"" + request.session() + "\",\n"
        + "\"uri()\":\"" + request.uri() + "\",\n"
        + "\"url()\":\"" + request.url() + "\",\n"
        + "\"userAgent\":\"" + request.userAgent() + "\"\n"
        + "}";
  }


}
