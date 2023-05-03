fetch('/data/pitchfork_dataset.json')
    .then((response) => response.json())
    .then((pitchfork_data) => {
        let scatter_chart = {
            data: [
                {
                    x: pitchfork_data['pubDate'],
                    y: pitchfork_data['rating'],
                    text: pitchfork_data['album'],
                    mode: 'markers',
                    type: 'scatter',
                    transforms: [
                        {
                            type: 'groupby',
                            groups: pitchfork_data['artist_gender'],
                        },
                    ],
                    hovertemplate:
                        '<b>%{text}</b><br><br>' +
                        '%{yaxis.title.text}: %{y}<br>' +
                        '%{xaxis.title.text}: %{x}<br>' +
                        '<extra></extra>',
                },
            ],
            layout: {
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                margin: {t: 30, b: 30, l: 30, r: 2},
                hovermode: 'closest',
                xaxis: {
                    title: 'Review date',
                    zeroline: false,
                },
                yaxis: {
                    title: 'Score',
                    zeroline: false,
                },
            },
        };

        Plotly.newPlot('chart', scatter_chart.data, scatter_chart.layout);
    });
