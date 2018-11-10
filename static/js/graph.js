queue()
    .defer(d3.csv, "data/Salaries.csv")     // defer has 2 arguments; first is format of the data we want to load; second is the path to file
    .await(makeGraphs);                     //await has one argument-the name of the function we want to call when the data is loaded

function makeGraphs(error, salaryData) {
    var ndx = crossfilter(salaryData);      //create crossfilter

    salaryData.forEach(function (d) {
        d.salary = parseInt(d.salary);
    })

    show_discipline_selector(ndx);          //pass 'ndx' variable to function that gonna draw a graph
    show_gender_balance(ndx);
    show_average_salary(ndx);

    dc.renderAll();                         //without it nothing will be show on the page
}

function show_discipline_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('discipline'));
    var group = dim.group();

    dc.selectMenu("#discipline-selector")
        .dimension(dim)
        .group(group);
}


function show_gender_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('sex'));
    var group = dim.group();

    dc.barChart("#gender-balance")          //this barchart will be rendered in element with that id
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)   
        .transitionDuration(500)            //how quickly the chart animates when we filter 
        .x(d3.scale.ordinal())              //ordinal, beacause dimension consists of the words
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")               //label for x axis
        .yAxis().ticks(20);                 //number of ticks on y axis
}


function show_average_salary(ndx) {
    var dim = ndx.dimension(dc.pluck('sex'));

    function add_item(p, v) {               //p is an accumulator, that keeps track of the total count
        p.count++;                          //v represents each of the data that we adding or removing
        p.total += v.salary;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else {
            p.total -= v.salary;
            p.average = p.total / p.count;
        }
        return p;
    }

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }

    var averageSalaryByGender = dim.group().reduce(add_item, remove_item, initialise);


    dc.barChart("#average-salary")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(averageSalaryByGender)
        .valueAccessor(function (d) {
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(4);


}