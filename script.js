

window.onload = () => {
    getTotalcases();
    getCountryData();
    getHistoricalData();
}


var map;
var infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8283, lng: -98.5795},
        zoom: 3,
        styles: mapStyle
    });
    infoWindow = new google.maps.InfoWindow();
}

const getTotalcases= () =>{
    fetch("https://disease.sh/v2/all?yesterday=true")
    .then((data) =>{
            return data.json()
    }).then((data)=>{
        let setted = setTotalData(data);
        buildpieChart(setted);
    })
}
const setTotalData= (data)=>{
    let TotalDic = {
        '0': numeral(data.cases).format('0,0'),
        '1': numeral(data.active).format('0,0'),
        '2': numeral(data.recovered).format('0,0'),
        '3': numeral(data.deaths).format('0,0'),
    }
    let TotElments = document.querySelectorAll(".card-subtitle");
    for(let totnum in TotElments){
            TotElments[totnum].innerText = TotalDic[totnum]
        }
        return TotalDic;
};

const getCountryData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        showDataOnMap(data);
        // showDataInTable(data);
    })
};

const getHistoricalData = () => {
    fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        let chartData = buildChartData(data);
        buildlineChart(chartData);
    })
};

const buildChartData = (data) => {
    let chartData = {
        cases: [],
        recovered: [],
        deaths: [],
    };
    for(kind in data){
        for(actualdata in data[kind]){
            let newdatapoint = {
                x: actualdata,
                y: data[kind][actualdata]
            };
            chartData[kind].push(newdatapoint);
        };
    };
    return chartData;
};


const buildlineChart = (chartData) => {
    var timeFormat = 'MM/DD/YY';
    var ctx = document.getElementById('Total-Chart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            datasets: [
                {
                    label: 'Total Deaths',
                    data: chartData.deaths,
                    backgroundColor: '#FF4136',
                    // borderColor: '#FF4136',
                    // pointStyle: 'circle',
                    // fill: '-1',
                    borderWidth: 0,
                    radius: 0.3,
                },
                {
                    label: 'Total Recovered',
                    data: chartData.recovered,
                    backgroundColor: '#01FF70',
                    // borderColor: '#01FF70',
                    // pointStyle: 'circle',
                    // fill: 'true',
                    borderWidth: 0,
                    radius: 0.3,
                },
                {
                label: 'Total Cases',
                data: chartData.cases,
                backgroundColor: '#0074D9',
                // borderColor: '#0074D9',
                // pointStyle: 'circle',
                // fill: true,
                borderWidth: 0,
                radius: 0.3,
            },

        ]
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'Line Chart'
              },
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false
            },
            scales:     {
                xAxes: [{
                    type: "time",
                    time: {
                        format: timeFormat,
                        tooltipFormat: 'll'
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return numeral(value).format('0,0');
                        }
                    }
                }],
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                responsive: true,
                    legend: {
                position: 'top',
                },
            }
        }
    });
};

const buildpieChart = (setted) =>{
    var ctx = document.getElementById('pie')
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: 
        {
            labels: ['Deaths', 'Active', 'Recovered'],
            datasets: [
             /* Outer doughnut data starts*/
            {
              data: [
                numeral(setted['3']).value(),
                numeral(setted['2']).value(),
                numeral(setted['1']).value()
              ],
              backgroundColor: [
                "#FF4136", // red
                "#01FF70", // green
                "rgb(54, 162, 235)", //blue
              ],
            },
            ]

        },
        options: {
            responsive: true,
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Doughnut Chart'
            },
            animation: {
              animateScale: true,
              animateRotate: true
            },
            tooltips: {
              callbacks: {
                label: function(item, data) {
                    return data.datasets[item.datasetIndex].label+ ": "+ data.labels[item.index]+ ": "+ data.datasets[item.datasetIndex].data[item.index];
                }
            }
        }
    }
        

    });

};



const openInfoWindow = () => {
    infoWindow.open(map);
};


const showDataOnMap = (data) => {
    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        var countryCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: country.cases
        });

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

// const showDataInTable = (data) => {
//     var html = '';
//     data.forEach((country)=>{
//         html += `
//         <tr>
//             <td>${country.country}</td>
//             <td>${country.cases}</td>
//             <td>${country.recovered}</td>
//             <td>${country.deaths}</td>
//         </tr>
//         `
//     })
//     document.getElementById('table-data').innerHTML = html;
// };