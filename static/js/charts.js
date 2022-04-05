function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var sampleArray = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var results = sample.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var sample01 = results[0];
    console.log(sample01);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata_Sample = metadataArray[0]

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sample01.otu_ids;
    var otu_labels = sample01.otu_labels;
    var sample_values = sample01.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wash_freq = parseFloat(metadata.wfreq)

    // Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0, 10).reverse();
    var xticks = sample_values.slice(0, 10).reverse();
    var labels = otu_labels.slice(0, 10).reverse();

    // Use Plotly to plot the bar data and layout.
    var barData = [{
      x: xticks,
      y: yticks,
      text: labels,
      type: 'bar',
      orientation: 'h'}];

    var bar_trace = barData;

    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'};


    Plotly.newPlot('bar', bar_trace, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    var bubbleData = [{
      x: xticks,
      y: yticks,
      text: labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: Earth}}];

    var bubble_trace = bubbleData;
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture per Sample",
      margin: {t:0},
      xaxis: {title: "OTU ID"},
      hover: 'closest',
      margin: {t:30},};

      Plotly.newPlot('bubble', bubble_trace, bubbleLayout); 
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x:[0,1], y:[0,1]},
        value: frequency,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "<b>Belly Button Washing Frequency</b><br> Scrubs Per Week"},
        gauge: {
          axis: {range:[null, 10]},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "yellowgreen"},
            {range: [8,10], color: "green"}
          ]
        }
      }
    ];

    var gauge_trace = gaugeData

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 425,
      margin: {t:0, b:0}};

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gauge_trace, gaugeLayout);
  });
}
