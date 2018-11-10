//load data
queue()
    .defer(d3.csv, "data/Salaries.csv")     // defer has 2 arguments; first is format of the data we want to load; second is the path to file
    .await(makeGraphs);                     //await has one argument-the name of the function we want to call when the data is loaded

function makeGraphs(error, salaryData) {
    var ndx = crossfilter(salaryData);      //create crossfilter

    show_gender_balance(ndx);               //pass 'ndx' variable to function that gonna draw a graph
    show_discipline_selector(ndx);

    dc.renderAll();                         //without it nothing will be show on the page
}

function show_discipline_selector (ndx) {  
    dim = ndx.dimension(dc.pluck('discipline'));
    group = dim.group();

    dc.selectMenu('#discipline-selector')
        .dimension(dim)
        .group(group);
}

function show_gender_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('sex'));
    var group = dim.group();
    

    dc.barChart("#gender-balance")      //this barchart will be rendered in element with that id
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)        //how quickly the chart animates when we filter
        .x(d3.scale.ordinal())          //ordinal, beacause dimension consists of the words
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")           //label for x axis
        .yAxis().ticks(20);             //number of ticks on y axis
}