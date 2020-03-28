////// hbar function start ///////
function drawBarGraph(id)
{
    console.log(`drawing bar graph using id: ${id}`);
    
    // defining file path to samples.json data file
    var filePath = "../../data/samples.json";

    // reading in samples.json data using d3
    d3.json(filePath)
      .then((data) => {
        
        // setting up data retrieval
        var samples = data.samples;
        var resultArray = samples.filter((s) => s.id == id);
        var result = resultArray[0];
        
        // getting and defining desired variables
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        
        // defining yticks
        var yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
        
        // setting up trace for hbar graph
        var barTrace = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0,10).reverse(),
            orientation: "h"
        };
        
        // defining data array for hbar
        var barData = [barTrace];
        
        // defining layout for hbar plot
        var barLayout = {
            title: `Top Ten Microbes Found in Sample ${id}`,
            margin: {t: 30, l: 150}
        };
        
        // plotting hbar plot with plotly
        // placing in html section with id = 'bar'
        Plotly.newPlot("bar", barData, barLayout);
        
    });
}
////// hbar chart function end ///////

////// bubble chart function start //////
function drawBubbleChart(id)
{
    console.log(`drawing bubble chart using id: ${id}`);

// defining file path to samples.json data file
    var filePath = "../../data/samples.json";

    // reading in samples.json data using d3
    d3.json(filePath)
      .then((data) => {
        
        // framework to get data
        var samples = data.samples;
        var resultArray = samples.filter((s) => s.id == id);
        var result = resultArray[0];
        
        // getting and defining desired variables
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        
        // defining trace for bubble chart
        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        };
        
        // defining bubble chart data array using bubbleTrace
        var bubbleData = [bubbleTrace];
        
        // defining bubble layout for plot
        var bubbleLayout = {
            title: `Microbes in Sample ${id}`,
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Value"},
            height: 650,
            width: 1000

        };
        
        // plotting bubble chart using plotly
        // placing in html section with id = 'bubble'
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
   
    });
    
}
//////// bubble chart function end ///////

/////// bonus gauge function starts here ///////
function drawGauge(id)
{
    console.log(`calling gauge with id: ${id}`);
    
    // defining file path to samples.json data file
    var filePath = "../../data/samples.json";

    // reading in samples.json data using d3
    d3.json(filePath)
      .then((data) => {
        
        // framework for getting data 
        var metadata = data.metadata;
        var resultArray = metadata.filter((md) => md.id == id);
        var result = resultArray[0];
        
        // getting and defining desired variable of wash frequency
        var washFreq = result.wfreq;
        
        // create gauge trace
        var gaugeTrace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: `Belly Button Washes per Week for Sample ${id} \n` },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10] },
                steps: [{range: [0,2]}]
            }
        };
        
        // create data array containing trace
        var gaugeData = [gaugeTrace];
        
        // define gauge layout
        var gaugeLayout = {
             width: 600,
             height: 500, 
             margin: { t: 0, b: 0 }
        };
        
        // create gauge plot using plotly
        // placing in html section with id = 'gauge'
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
    
}
////// bonus gauge function end ///////

//////// function to get and show sample metadata starts here /////////
function showMetaData(id)
{
    console.log(`getting metadata for sample ${id}`);
    
    // defining file path to samples.json data file
    var filePath = "../../data/samples.json";
    
    // reading in json data using d3
    d3.json(filePath)
      .then((data) => {
        
        // creating framework for getting desired data
        var metadata = data.metadata;
        var resultArray = metadata.filter((md) => md.id == id);
        var result = resultArray[0];
        
        // selecting desired area of html to place data using d3
        var infoPanel = d3.select("#sample-metadata");
        
        // clearing recent panel/anything that does not belong in current selection
        infoPanel.html("");
        
        // for each loop to append all key:value pairs from the metadata 
        // of the selected id
        Object.entries(result).forEach(([key, value]) => {
            
            // appending row for each [key,value] pair in metadata
            infoPanel.append("h4").text(`${key} : ${value}`);
        });
    });
}
//////// function to get and show sample metadata ends here ///////

// event handler function for when a new id is selected on page
// it executes all four of the above functions
// passing the new selection as the new parameter
function optionChanged(newSelection) 
{
    console.log(`The user selected ${newSelection}`);
    
    drawBubbleChart(newSelection);
    drawBarGraph(newSelection);
    drawGauge(newSelection);
    showMetaData(newSelection);
};

// initializing page with start data
function initPage() 
{
    
    console.log("Inizializing Page"); 
    
    // selecting dropdown menu using d3
    var menu = d3.select("#selDataset");
    
    // defining file path to samples.json data file
    var filePath = "../../data/samples.json";
    
    // reading in json data using d3
    d3.json(filePath)
      .then((data) => {
        console.log("init data" , data);
        
        // gets all ids 
        var sampleNames = data.names; 
        
        // appends each id to create 
        // a full dropdown menu containing
        // all ids as options to select
        sampleNames.forEach((id) => {
            menu.append("option")
                .text(id)
                .property("value", id);
        });
        
        // initializes page (all plots/info) using first id
        var id = sampleNames[0];
        
        drawBubbleChart(id);
        drawBarGraph(id);
        drawGauge(id);
        showMetaData(id);
        
    });
};

initPage();



