let map = undefined;
let circles = [];
let markers = [];
let styless = {
  light: lightmode,
  dark: nightmode,
};
let bounds = null;
let geoLat = 30;
let geoLng = 0;
let markerCluster = null;

let us_states_data = getProvincesForCountry("us");
let ca_province_data = getProvincesForCountry("ca");
let br_province_data = getProvincesForCountry("br");
let de_province_data = getProvincesForCountry("de");
let fr_province_data = getProvincesForCountry("fr");
let in_province_data = getProvincesForCountry("in");

function getProvincesForCountry(code) {
  return provinces_data.filter(function (data) {
    return data.country_id === code;
  });
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// get stored theme in cookies, if dne, store them
let theme = "dark";
let tempTheme = getCookie("theme");
if (tempTheme != null) {
  theme = tempTheme;
  if (theme === "light") {
    var icon = document.getElementById("modeIcon");
    icon.classList = "fas fa-moon";
    document.getElementById("changeMode").style.backgroundColor = "#546bab";
  }
} else {
  document.cookie = "theme=dark";
}

function initMap(position) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: geoLat,
      lng: geoLng,
    },
    restriction: {
      latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
      strictBounds: true,
    },
    zoom: 3,
    minZoom: 2,
    disableDefaultUI: true,
    styles: styless[theme],
    useStaticMap: true,
  });
  bounds = map.getBounds();

  $.getJSON("topo-sm.json", function (data) {
    let geoJsonObject = topojson.feature(data, data.objects["custom.geo"]);
    map.data.addGeoJson(geoJsonObject, {
      idPropertyName: "iso_a2",
    });

    country_data.forEach(function (country) {
      var feature = map.data.getFeatureById(country.country_id);
      if (feature) {
        try {
          feature.setProperty("name", country.country_name);
          feature.setProperty("url", country.image_url);
          feature.setProperty("confirmed", country.confirmed);
          feature.setProperty("c_velocity", country.velocity_confirmed);
          feature.setProperty("dead", country.dead);
          feature.setProperty("d_velocity", country.velocity_dead);
          feature.setProperty("recovered", country.recovered);
          feature.setProperty("r_velocity", country.velocity_recovered);
          feature.setProperty("population", country.population);
          feature.setProperty("updated", country.updated);
        } catch {
          console.log(country);
        }
      }
    });

    var loaded = parseInt(document.getElementById("mapLoadStatus").innerHTML);
    document.getElementById("mapLoadStatus").innerHTML = loaded + 1;
  });

  $.getJSON("topo-us-states-sm.json", function (data) {
    var geoJsonObject = topojson.feature(data, data.objects["us_states_geo"]);
    map.data.addGeoJson(geoJsonObject, {
      idPropertyName: "admin",
    });

    us_states_data.forEach(function (state) {
      var feature = map.data.getFeatureById(state.province_name);
      if (feature) {
        feature.setProperty("name", state.province_name);
        feature.setProperty("url", state.image_url);
        feature.setProperty("confirmed", state.confirmed);
        feature.setProperty("c_velocity", state.velocity_confirmed);
        feature.setProperty("dead", state.dead);
        feature.setProperty("d_velocity", state.velocity_dead);
        feature.setProperty("recovered", state.recovered);
        feature.setProperty("r_velocity", state.velocity_recovered);
        feature.setProperty("population", state.population);
        feature.setProperty("updated", state.updated);
      }
    });

    var loaded = parseInt(document.getElementById("mapLoadStatus").innerHTML);
    document.getElementById("mapLoadStatus").innerHTML = loaded + 1;
  });

  $.getJSON("topo-canada-provinces-sm.json", function (data) {
    var geoJsonObject = topojson.feature(
      data,
      data.objects["canada_provinces"]
    );
    map.data.addGeoJson(geoJsonObject, {
      idPropertyName: "admin",
    });

    ca_province_data.forEach(function (state) {
      var feature = map.data.getFeatureById(state.province_name);
      if (feature) {
        feature.setProperty("name", state.province_name);
        feature.setProperty("url", state.image_url);
        feature.setProperty("confirmed", state.confirmed);
        feature.setProperty("c_velocity", state.velocity_confirmed);
        feature.setProperty("dead", state.dead);
        feature.setProperty("d_velocity", state.velocity_dead);
        feature.setProperty("recovered", state.recovered);
        feature.setProperty("r_velocity", state.velocity_recovered);
        feature.setProperty("population", state.population);
        feature.setProperty("updated", state.updated);
      }
    });
    var loaded = parseInt(document.getElementById("mapLoadStatus").innerHTML);
    document.getElementById("mapLoadStatus").innerHTML = loaded + 1;
  });

  $.getJSON("topo-brazil-provinces-sm.json", function (data) {
    var geoJsonObject = topojson.feature(data, data.objects["brazil-states"]);
    map.data.addGeoJson(geoJsonObject, {
      idPropertyName: "admin",
    });

    br_province_data.forEach(function (state) {
      var feature = map.data.getFeatureById(state.province_name);
      if (feature) {
        feature.setProperty("name", state.province_name);
        feature.setProperty("url", state.image_url);
        feature.setProperty("confirmed", state.confirmed);
        feature.setProperty("c_velocity", state.velocity_confirmed);
        feature.setProperty("dead", state.dead);
        feature.setProperty("d_velocity", state.velocity_dead);
        feature.setProperty("recovered", state.recovered);
        feature.setProperty("r_velocity", state.velocity_recovered);
        feature.setProperty("population", state.population);
        feature.setProperty("updated", state.updated);
      }
    });

    var loaded = parseInt(document.getElementById("mapLoadStatus").innerHTML);
    document.getElementById("mapLoadStatus").innerHTML = loaded + 1;
  });

  $.getJSON("/topo-german-provinces-sm.json", function (data) {
    var geoJsonObject = topojson.feature(data, data.objects["germany"]);
    map.data.addGeoJson(geoJsonObject, {
      idPropertyName: "admin",
    });

    de_province_data.forEach(function (state) {
      var feature = map.data.getFeatureById(state.province_name);
      if (feature) {
        feature.setProperty("name", state.province_name);
        feature.setProperty("url", state.image_url);
        feature.setProperty("confirmed", state.confirmed);
        feature.setProperty("c_velocity", state.velocity_confirmed);
        feature.setProperty("dead", state.dead);
        feature.setProperty("d_velocity", state.velocity_dead);
        feature.setProperty("recovered", state.recovered);
        feature.setProperty("r_velocity", state.velocity_recovered);
        feature.setProperty("population", state.population);
        feature.setProperty("updated", state.updated);
      }
    });

    var loaded = parseInt(document.getElementById("mapLoadStatus").innerHTML);
    document.getElementById("mapLoadStatus").innerHTML = loaded + 1;
  });

  $.getJSON("/topo-france-provinces-sm.json", function (data) {
    var geoJsonObject = topojson.feature(data, data.objects["regions"]);
    map.data.addGeoJson(geoJsonObject, {
      idPropertyName: "admin",
    });

    fr_province_data.forEach(function (state) {
      var feature = map.data.getFeatureById(state.province_name);
      if (feature) {
        feature.setProperty("name", state.province_name);
        feature.setProperty("url", state.image_url);
        feature.setProperty("confirmed", state.confirmed);
        feature.setProperty("c_velocity", state.velocity_confirmed);
        feature.setProperty("dead", state.dead);
        feature.setProperty("d_velocity", state.velocity_dead);
        feature.setProperty("recovered", state.recovered);
        feature.setProperty("r_velocity", state.velocity_recovered);
        feature.setProperty("population", state.population);
        feature.setProperty("updated", state.updated);
      }
    });

    var loaded = parseInt(document.getElementById("mapLoadStatus").innerHTML);
    document.getElementById("mapLoadStatus").innerHTML = loaded + 1;
  });

  $.getJSON("/topo-india-provinces-sm.json", function (data) {
    var geoJsonObject = topojson.feature(data, data.objects["polygons"]);
    map.data.addGeoJson(geoJsonObject, {
      idPropertyName: "admin",
    });

    in_province_data.forEach(function (state) {
      var feature = map.data.getFeatureById(state.province_name);
      if (feature) {
        feature.setProperty("name", state.province_name);
        feature.setProperty("url", state.image_url);
        feature.setProperty("confirmed", state.confirmed);
        feature.setProperty("c_velocity", state.velocity_confirmed);
        feature.setProperty("dead", state.dead);
        feature.setProperty("d_velocity", state.velocity_dead);
        feature.setProperty("recovered", state.recovered);
        feature.setProperty("r_velocity", state.velocity_recovered);
        feature.setProperty("population", state.population);
        feature.setProperty("updated", state.updated);
      }
    });

    var loaded = parseInt(document.getElementById("mapLoadStatus").innerHTML);
    document.getElementById("mapLoadStatus").innerHTML = loaded + 1;
  });
}
