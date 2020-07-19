const showDataInTable = () => {
  var html = "";
  country_data.forEach((country) => {
    html += `
    <tr>
    <th id="photo"><img src="${country.image_url}"/></th>
    <td id="cn">${country.confirmed}</td>
    <td id="rec">${country.recovered}</td>
    <td id="dead">${country.dead}</td>
  </tr>
        `;
  });
  document.getElementById("table-data").innerHTML = html;
};

// Get Live Data
var CountryLiveData;
fetch("https://www.trackcorona.live/api/countries")
  .then((res) => res.json())
  .then((data) => {
    CountryLiveData = data.data;
    // Sort For Fitting
    CountryLiveData = CountryLiveData.sort(function (a, b) {
      var x = a.country_code;
      var y = b.country_code;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    // for dropORGZ
    var k = CountryLiveData.sort(function (a, b) {
      var x = a.country_id;
      var y = b.country_id;
      return y < x ? -1 : y > x ? 1 : 0;
    });
    // Update Map Data
    CountryLiveData.forEach((d, i) => {
      country_data[i].updated = d.updated;
      country_data[i].confirmed = d.confirmed;
      country_data[i].dead = d.dead;
      country_data[i].recovered = d.recovered;
    });
    CountryLiveData.forEach(
      (d) => (v[d.country_code] = { lat: d.latitude, long: d.longitude })
    );

    setTimeout(function () {
      alertify.success(`Countries, Updated!! 🚀💯`);
    }, 3000);
    setSearchList(k);

    showDataInTable();
  });

fetch("https://www.trackcorona.live/api/provinces")
  .then((res) => res.json())
  .then((data) => {
    ProvinceLiveData = data.data;
    // Organize Live DATA
    ProvinceLiveData = ProvinceLiveData.sort(function (a, b) {
      var x = a.country_id;
      var y = b.country_id;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    // Update Map Data
    ProvinceLiveData.forEach((d, i) => {
      provinces_data[i].updated = ProvinceLiveData[i].updated;
      provinces_data[i].confirmed = ProvinceLiveData[i].confirmed;
      provinces_data[i].dead = ProvinceLiveData[i].dead;
      provinces_data[i].recovered = ProvinceLiveData[i].recovered;
    });
    setTimeout(function () {
      alertify.success(`Provinces, Updated!! 🚀💯`);
    }, 3000);
  });

fetch("https://www.trackcorona.live/api/cities")
  .then((res) => res.json())
  .then((data) => {
    CityLiveData = data.data;
    // Organize Live DATA
    CityLiveData = CityLiveData.sort(function (a, b) {
      var x = a.country_id;
      var y = b.country_id;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    // Update Map Data
      city_data.forEach((d, i) => {
        city_data[i].updated = CityLiveData[i].updated;
        city_data[i].confirmed = CityLiveData[i].confirmed;
        city_data[i].dead = ]CityLiveData[i].dead;
        city_data[i].recovered = CityLiveData[i].recovered;
      });
    setTimeout(function () {
      alertify.success(`Cities, Updated!! 🚀💯`);
    }, 3000);
  });

const setMapCenter = (lat, long, zoom) => {
  map.setZoom(zoom);
  map.panTo({
    lat: lat,
    lng: long,
  });
};

const initDropdown = (searchList) => {
  $(".ui.dropdown").dropdown({
    values: searchList,
    onChange: function (value, text) {
      if (!Number.isInteger(value)) {
        if (value !== wordwideSelection.value) {
          map.panTo({
            lat: v[value]["lat"],
            lng: v[value]["long"],
          });
          map.setZoom(3);
        } else {
          map.setZoom(1);
        }
      }
    },
  });
  // setTimeout(function () {
  //   alertify.warning(`Unfortunately MY MAP NEEDS BILLING API 🤦😓`);
  // }, 3000);
  setTimeout(function () {
    alertify.warning(`MAYBE WHEN I WIN HAHA😝💯🚀`);
  }, 3000);
  setTimeout(function () {
    alertify.warning(`STAY SAFE!!🖤❤💜`);
  }, 3000);
};

const wordwideSelection = {
  name: "Worldwide",
  value: "www",
  selected: true,
};
let searchList = [];
var v = {};
const setSearchList = (k) => {
  searchList.push(wordwideSelection);
  k.forEach((countryData, i) => {
    searchList.push({
      name: countryData.location,
      value: countryData.country_code,
    });
  });
  initDropdown(searchList);
};
