package com.tripco.t11.misc;

public class Place {
    private String name;
    private String latitude;
    private String longitude;
    private String id;
    private String municipality;
    private String altitude;
    private String region;
    private String country;
    private String continent;

    public Place(String name, String latitude, String longitude, String id, String municipality, String altitude, String region, String country, String continent) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.id = id;
        this.municipality = municipality;
        this.altitude = altitude;
        this.region = region;
        this.country = country;
        this.continent = continent;
    }

    public String getName() {
        return name;
    }

    public String getLatitude() {
        return latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public String getId() {
        return id;
    }

    public String getMunicipality() {
        return municipality;
    }

    public String getAltitude() {
        return altitude;
    }

    public String getRegion() {
        return region;
    }

    public String getCountry() {
        return country;
    }

    public String getContinent() {
        return continent;
    }
}
