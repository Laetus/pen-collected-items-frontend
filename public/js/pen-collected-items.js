// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

function queryFieldByLocationAndRange() {

    //obtain values
    var params = {
        x: parseInt(document.getElementById("field-location-x").value),
        y: parseInt(document.getElementById("field-location-y").value),

    };
    if (document.getElementById("query-range-from").value !== "") {
        params.from = document.getElementById("query-range-from").value;
        if (document.getElementById("query-range-to").value !== "") {
            params.to = document.getElementById("query-range-to").value;
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:5000/field?" + $.param(params),
            "method": "GET",
            "headers": {
                "cache-control": "no-cache"
            }
        }
        $("#result-analysis1").toggle();

        $.ajax(settings).done(function (response) {
            $("#result-body-loading").toggle();
            $("#result-body").toggle();

            ctx = document.getElementById("analysis1");
            myAnalysis = new Chart(ctx, getValuesForNewGraph(response));

        });
    }
}

function getValuesForNewGraph(result) {
    var default_val = {
        type: 'line',
        data: {
            labels: ["", ""],
            datasets: [{
                label: "Visitors",
                lineTension: 0.3,
                backgroundColor: "rgba(2,117,216,0.2)",
                borderColor: "rgba(2,117,216,1)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(2,117,216,1)",
                pointBorderColor: "rgba(255,255,255,0.8)",
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                pointHitRadius: 20,
                pointBorderWidth: 2,
                data: [0, 0],
            }],
        },
        options: {
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1,
                        maxTicksLimit: 5
                    },
                    gridLines: {
                        color: "rgba(0, 0, 0, .125)",
                    }
                }],
            },
            legend: {
                display: false
            }
        }
    }

    function parseResponse(result) {
        function getLabel(date) {
            return date.getDate() + ". " + (date.getMonth() + 1) + " " + date.getYear();
        };
        function getData(act_date, visitors_elem) {
            date = new Date(visitors_elem.date);
            if (date.getTime() === act_date.getTime()) {
                return visitors_elem.visitor_count;
            } else {
                return 0;
            }
        };
        function getNextDate(act_date, act_data, next_element) {
            if (next_element === undefined) {
                return new Date(1e5, 1, 1)
            } else {
                act_date.setDate(act_date.getDate() + 1);
                var next_date = new Date(next_element.date);
                if (act_date.getTime() === next_date.getTime()) {
                    return act_date;
                }
                if (act_data <= 0) {
                    return next_date;
                } else {
                    return act_date;
                }
            }
        }

        var visitors = result.visitors;
        var from_date = new Date(result.from)
        from_date.setDate(from_date.getDate() - 1);
        var act_date = getNextDate(from_date, 1, visitors[0]);
        var to = new Date(result.to);
        default_val.data.labels = [];
        default_val.data.datasets[0].data = [];
        var act_data, act_elem;

        while (act_date < to) {
            act_elem = visitors.shift();
            default_val.data.labels.push(getLabel(act_date));
            act_data = getData(act_date, act_elem);
            default_val.data.datasets[0].data.push(act_data)
            act_date = getNextDate(act_date, act_data, visitors[0]);
        }

        default_val.options.scales.yAxes[0].ticks.max = Math.ceil(result.max_visitors.visitor_count / 10 * 1.1) * 10
    }

    if (result !== undefined) {
        parseResponse(result);
    }


    return default_val;
};


//var ctx = document.getElementById("analysis1");
//var myAnalysis = new Chart(ctx, getValuesForNewGraph());
document.getElementById("queryFieldByLocationAndRange").onclick = queryFieldByLocationAndRange;