import data from '/js/pitchfork-dataset.js';

var trace = {
    x: data['pubDate'],
    y: data['rating'],
    mode: 'markers',
    type: 'scatter',
};
var charts = [trace];

Plotly.newPlot('chart', charts);
