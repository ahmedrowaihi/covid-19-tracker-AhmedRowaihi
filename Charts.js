const buildChartlineData = (data) => {
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
    var ctxx = document.getElementById('Total-Chart').getContext('2d');
    var chart = new Chart(ctxx, {
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
                    backgroundColor: '#88B04B',
                    // borderColor: '#88B04B',
                    // pointStyle: 'circle',
                    // fill: 'true',
                    borderWidth: 0,
                    radius: 0.3,
                },
                {
                label: 'Total Cases',
                data: chartData.cases,
                backgroundColor: '#92A8D1',
                // borderColor: '#92A8D1',
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

var piechart;
const buildpieChart = (data) =>{
    var ctxp = document.getElementById('pie').getContext('2d');
    var configp = {
        type: 'pie',
        data:
        {
            datasets:
            [
                {
                    data:
                    [
                        0,
                        0,
                        0,
                        data['cases'],
                    ],
                    backgroundColor: 
                    [
                        "#DD4124", // red
                        "#88B04B", // green
                        "#92A8D1", //blue
                        "#EFC050", // Yellow
                    ],
                    label: 'Inner'

                },
                {
                
                    data: [
                        data['deaths'],
                        data['recovered'],
                        data['active'],
                        0,
                        ],
                        backgroundColor: 
                        [
                        "#DD4124", // red
                        "#88B04B", // green
                        "#92A8D1", //blue
                        "#EFC050", // Yellow
                        ],
                        label: 'Outter'
                }
        
            ],
                
            labels: 
                
            [
                    'Deaths', 'Active', 'Recovered','Total Cases',
            ],
            
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
        }
    };

     piechart = new Chart(ctxp, configp);
};


const pielooks = (kind)=>{
    if(kind.value === 'pie'){
        piechart.options.cutoutPercentage = 0;
        window.piechart.update();
    } else if (kind.value === 'doughnut'){
        piechart.options.cutoutPercentage = 50;
        window.piechart.update();
    }
}