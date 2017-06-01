// Create a variable with the url to the csv file
var url = "https://raw.githubusercontent.com/atiredturtle/code1161base/master/Project/World_Languages.csv";

var loaded = false;
var CSVdata;
var dict = {};

Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {  
        console.log("YAY");
        CSVdata = results;
        processData(CSVdata.data);
        drawChart(dict);
    }
});


function processData(d){
    //console.log(d);
    for (var i = 0; i < d.length; i++){
        var firstLang = d[i].WORLD_LANGUAGES_FIRST;
        if (firstLang in dict){
            dict[firstLang]++;
        } else {
            dict[firstLang] = 1;
        }
    }
    console.log(dict);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor(){
    var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 255);
    var b = getRandomInt(0, 255);
    return 'rgba('+r+', '+g+', '+b+', 0.6)';
}

function drawChart(dict){
    var my_keys = [];
    var my_data = [];
    var my_colors = [];
    for (var key in dict) {
        my_keys.push(key);
        my_data.push(dict[key]);
        my_colors.push(getRandomColor());
    }

    var ctx = "myChart";
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: my_keys,
            datasets: [{
                label: 'Testing loading my own data',
                data: my_data,
                backgroundColor: my_colors,
            }]
        },
        options: {
            responsive: false
        }
    });
}


