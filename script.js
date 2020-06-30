const setTotalStatus= (data)=>{
    let TotalDic = {
        '0': data.cases,
        '1': data.active,
        '2': data.recovered,
        '3': data.deaths,
    }
    let TotElments = document.querySelectorAll(".card-subtitle");
    for(let totnum in TotElments){
            TotElments[totnum].innerText = numeral(TotalDic[totnum]).format(0,0)
        }
};


const getCountryData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        coronaGlobalData = data;
        showDataOnMap(data);
        showDataInTable(data);
    })
};



var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
var casesTypeColors = {
    cases: '#1d2c4d',
    active: '#9d80fe',
    recovered: '#7dd71d',
    deaths: '#fb4443'
}
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8283, lng: -98.5795},
        zoom: 3,
        styles: mapStyle
    });
    infoWindow = new google.maps.InfoWindow();
}
var allcards = document.getElementsByClassName('card')
const changeDataSelection = (casesType, that) => {
    clearTheMap();
    showDataOnMap(coronaGlobalData, casesType);
    for(let i = 0; i < allcards.length; i++){
        allcards[i].classList.remove('active-card')
    }
    that.classList.add('active-card')
}
const clearTheMap = () => {
    for(let circle of mapCircles){
        circle.setMap(null);
    }
}


const showDataOnMap = (data, casesType="cases") => {
    
    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        var countryCircle = new google.maps.Circle({
            strokeColor: casesTypeColors[casesType],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: casesTypeColors[casesType],
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country[casesType]
        });

        mapCircles.push(countryCircle);

        var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered}
                </div>
                <div class="info-deaths">   
                    Deaths: ${country.deaths}
                </div>
            </div>
        `

        var infoWindow = new google.maps.InfoWindow({
            content: html,
            position: countryCircle.center
        });
        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
        });

        google.maps.event.addListener(countryCircle, 'mouseout', function(){
            infoWindow.close();
        })

    })

};




const showDataInTable = (data) => {
    var html = '';
    data.forEach((country)=>{
        html += `
        <tr>
            <td>${country.country}</td>
            <td>${country.cases}</td>
            <td>${country.recovered}</td>
            <td>${country.deaths}</td>
        </tr>
        `
    })
    document.getElementById('table-data').innerHTML = html;
};

const getWorldCoronaData= () =>{
    fetch("https://disease.sh/v2/all")
    .then((data) =>{
            return data.json()
    }).then((data)=>{
        buildpieChart(data);
        setTotalStatus(data);
    })
}

const getHistoricalData = () => {
    fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        let chartData = buildChartlineData(data);
        buildlineChart(chartData);
    })
};

window.onload = () => {
    getCountryData();
    getHistoricalData();
    getWorldCoronaData();
}