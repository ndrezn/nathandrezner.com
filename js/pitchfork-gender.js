fetch('/data/pitchfork_dataset.json')
    .then((response) => response.json())
    .then((pitchfork_data) => {
        let scatter_chart = {
            data: [
                {
                    x: pitchfork_data['pubDate'],
                    y: pitchfork_data['rating'],
                    mode: 'markers',
                    type: 'scatter',
                },
            ],
            layout: {
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
            },
        };

        Plotly.newPlot('chart', scatter_chart.data, scatter_chart.layout);
    });
