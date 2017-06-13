function testChart(){
    // Create a variable with the url to the csv file
    var url = "https://raw.githubusercontent.com/atiredturtle/code1161base/master/Project/World_Languages.csv";
    console.log("loading test");
    var loaded = false;
    var CSVdata;
    
    var ctx = "myChart";
    console.log(ctx.data);
    if (ctx.data != undefined) removeData(ctx);

    Papa.parse(url, {
        download: true,
        header: true,
        complete: function(results) {  
            console.log("YAY");
            CSVdata = results;
            var dict = test_processData(CSVdata.data);
            drawChart(dict);
        }
    });
}


function test_processData(d){
    var newdict = {};
    console.log(d);
    for (var i = 0; i < d.length; i++){
        var firstLang = d[i].WORLD_LANGUAGES_FIRST;
        if (firstLang in newdict){
            newdict[firstLang]++;
        } else {
            newdict[firstLang] = 1;
        }
    }
    console.log(newdict);
    return newdict;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor(){
    var r = getRandomInt(0, 255);
    var g = getRandomInt(0, 0);
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


