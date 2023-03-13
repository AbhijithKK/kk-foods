const currentUrl = window.location.href; // "http://localhost:3000/payment"
const currentDomain = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;


console.log(currentDomain);
let adminRoute
if (currentDomain ==  'https://kkfoods.online') {
    adminRoute='https://kkfoods.online'
}
if (currentDomain ==   'https://www.kkfoods.online') {
    adminRoute= 'https://www.kkfoods.online'
}
if (currentDomain ==    'http://3.227.231.17') {
    adminRoute=  'http://3.227.231.17'
}
if (currentDomain ==    'http://localhost:3000') {
    adminRoute= 'http://localhost:3000'
}


let revanue = []
fetch(`${adminRoute}/monthlyRevanue`, {
    method: "get",
    headers: {
        "Content-Type": "application/json"
    }
}).then((data) => data.json()).then((datass) => {

    datass.forEach((val) => {
        revanue.push(val)
    })


    var options = {
        series: [{
            name: 'Total Sales',
            data: [revanue[0], revanue[1], revanue[2], revanue[3], revanue[4], revanue[5], revanue[6], revanue[7], revanue[8], revanue[9], revanue[10], revanue[11]]
        }],
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return "₹" + val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },

        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            position: 'top',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {

                    return "₹" + val;
                }
            }

        },
        title: {
            text: 'Monthly Sales of kk foods',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#444'
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
})