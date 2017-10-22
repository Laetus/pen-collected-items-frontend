// Chart.js scripts
// -- Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Call the dataTables jQuery plugin
/* $(document).ready(function () {
    $('#fieldTable').DataTable();
}); */

function queryMultipleFieldsByLocationsAndRange() {

    //obtain values
    var params = {
        upper_left_x: parseInt(document.getElementById("field-location-ul-x").value),
        upper_left_y: parseInt(document.getElementById("field-location-ul-y").value),

        bottom_right_x: parseInt(document.getElementById("field-location-br-x").value),
        bottom_right_y: parseInt(document.getElementById("field-location-br-y").value),
    };
    if (document.getElementById("query-range-from").value !== "") {
        params.from = document.getElementById("query-range-from").value;
        if (document.getElementById("query-range-to").value !== "") {
            params.to = document.getElementById("query-range-to").value;
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:5000/area?" + $.param(params),
            "method": "GET",
            "headers": {
                "cache-control": "no-cache"
            }
        };
        $("#result-analysis2").show();
        $("#result-body-loading").show();

        $.ajax(settings).done(function (response) {
            $("#result-body-loading").hide();
            $("#result-body").show();
            $("#result-summary2").show();
            $("#result-table").show();


            ctx = document.getElementById("analysis2");
            myAnalysis = new Chart(ctx, getValuesForNewGraph(response));

        });
    }
}

function getValuesForNewGraph(result) {
    var default_val = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: "Visitors",
                backgroundColor: "rgba(2,117,216,1)",
                borderColor: "rgba(2,117,216,1)",
                data: [],
            }],
        },
        options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 6
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        //max: 15000,
                        maxTicksLimit: 5
                    },
                    gridLines: {
                        display: true
                    }
                }],
            },
            legend: {
                display: false
            }
        }
    };

    function parseResponse(result) {
        function getLabel(field) {
            return field.zone_id;
        };
        function getData(field) {
            if (field.visitor_count) {
                return field.visitor_count;
            } else {
                return 0;
            }
        };

        default_val.data.labels = [];
        default_val.data.datasets[0].data = [];

        for (var i in result.fields) {
            var act_field = result.fields[i];
            default_val.data.labels.push(getLabel(act_field));
            default_val.data.datasets[0].data.push(getData(act_field))

            $('#fieldTable tbody').append($('<tr>').append(
                $('<td>').text(act_field.zone_id),
                $('<td>').text(act_field.object_count),
                $('<td>').text(act_field.visitor_count),
                $('<td>').text(act_field.max_visitors.date),
                $('<td>').text(act_field.max_visitors.visitor_count)))
        }

        $('#summaryTable tbody').append($('<tr>').append(
            $('<td>').text(result.object_count),
            $('<td>').text(result.visitor_sum)))

        $(document).ready(function () {
            $('#fieldTable').DataTable();
        });
    }

    if (result !== undefined) {
        parseResponse(result);
    }


    return default_val;
}


document.getElementById("queryMultipleFieldsByLocationsAndRange").onclick = queryMultipleFieldsByLocationsAndRange;