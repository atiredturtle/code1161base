// Globals
var url = "https://raw.githubusercontent.com/atiredturtle/code1161base/master/Project/Web_Scrapped_websites.csv";
var MIN_TAIL = 10
var MAX_TAIL = 400

var MAX_TOP = 50;
var myChart;

// ----------------- DATA DICTS -----------------

// Name: allSitesDict
// Key: Site Name
// Value: Array counting popularity, indexed by popularity value. 
//        - E.g. if the 3st item is 10, then 10 countries have the site as their 3rd favourite
var allSitesDict = {};

function prepareCharts(){

    // parse data
    Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {  
            processData(results.data); // populate dicts with CSV data
            drawChart(allSitesDict);
            prepareSliders(); // initialise sliders
        }
    });
}
    
// takes parsed CSV and populates dicts accordingly
function processData(d){
    var tempSites = [];
    for (var i = 0; i < d.length; i++){
        var country = d[i].country;
        var website = d[i].Website;

        // for website popularity (dict value is number of countries that have it as a fav)
        if (website in allSitesDict){
            if (d[i].Country_Rank in allSitesDict[website]){
                allSitesDict[website][d[i].Country_Rank] += 1;
            } else {
                allSitesDict[website][d[i].Country_Rank] = 1;
            }
        } else {
            allSitesDict[website] = [];
            allSitesDict[website][d[i].Country_Rank] = 1;
        }
    }
}

function reduceDict(d, top){
    var retDict = {};
    for (var key in d){
        // counts number of popularity votes up to the 'top'th popularity
        // e.g if top = 4, only count the popularity from 1-4
        var occ = 0;
        for (var i = 1; i <= top; i++){
            if (d[key][i] !== undefined){
                occ += d[key][i];
            }
        }
        retDict[key] = occ;

    }
    return retDict;
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

function drawChart(d, top=MAX_TOP, tail=MIN_TAIL){
    d = reduceDict(d, top);
    if (myChart !== undefined) {myChart.destroy();}
    var my_keys = [];
    var my_data = [];
    var my_colors = [];

    var sortedKeys = Object.keys(d).sort(function(a, b) {return d[b] - d[a];});

    for (var i = 0; i < tail ; i++) {
        var key = sortedKeys[i];
        my_keys.push(key);
        my_colors.push(getRandomColor());
        my_data.push(d[key]);
    }

    var ctx = "myChart";
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: my_keys,
            datasets: [{
                label: '# popular votes from 1-'+parseInt(top),
                data: my_data,
                backgroundColor: my_colors,
            }]
        },
        options: {
            responsive: false
        }
    });
}


$(document).ready(function(){
    prepareCharts();
});


function prepareSliders(){
    // load sliders
    var itemSlider = document.getElementById('itemSlider');
    itemSlider.style.width = '400px';
    itemSlider.style.margin = '0 auto 30px';
    
    noUiSlider.create(itemSlider, {
        start: MIN_TAIL,
        connect: [true, false],
        step: 1,
        tooltips: true,
        range: {
            'min': MIN_TAIL,
            'max': MAX_TAIL
        }, pips: { // Show a scale with the slider
            mode: 'range',
            stepped: true,
            density: 10
        }
    });
    itemSlider.noUiSlider.on('change', function(){
        var tail = itemSlider.noUiSlider.get();
        var top  = popularitySlider.noUiSlider.get();
	    drawChart(allSitesDict, top, tail); 
    });

    var popularitySlider = document.getElementById('popularitySlider');
    popularitySlider.style.width = '400px';
    popularitySlider.style.margin = '0 auto 30px';
    noUiSlider.create(popularitySlider, {
        start: 50,
        connect: [true, false],
        step: 1,
        tooltips: true,
        range: {
            'min': 1,
            'max': MAX_TOP
        }, pips: { // Show a scale with the slider
            mode: 'range',
            stepped: true,
            density: 10
        }
    });
    popularitySlider.noUiSlider.on('change', function(){
        var tail = itemSlider.noUiSlider.get();
        var top  = popularitySlider.noUiSlider.get();
        drawChart(allSitesDict, top, tail); 
    });

}


