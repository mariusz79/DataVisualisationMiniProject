//load data

queue()
    .defer(d3.csv, 'data/Salaries.csv') //defer has 2 arguments; first is format of the data we want to load; second is the path to file
    .await(makeGraphs);                //await has one argument-the name of the function we want to call when the data is loaded

function makeGraphs(error, salaryData){
    
}