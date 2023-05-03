const generate_scatter = (dataset) => {
    let scatter_chart = {
        data: [
            {
                x: dataset['pubDate'],
                y: dataset['rating'],
                text: dataset['album'],
                mode: 'markers',
                type: 'scatter',
                transforms: [
                    {
                        type: 'groupby',
                        groups: dataset['artist_gender'],
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

    Plotly.newPlot('scatter-summary', scatter_chart.data, scatter_chart.layout);
};

const generate_box = (dataset) => {
    let box_chart = {
        data: [
            {
                x: dataset['pubYear'],
                y: dataset['rating'],
                text: dataset['album'],
                type: 'box',
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
                title: 'Review year',
                zeroline: false,
            },
            yaxis: {
                title: 'Score',
                zeroline: false,
            },
        },
    };

    Plotly.newPlot('box-plot', box_chart.data, box_chart.layout);
};

const get_year = (date) => {
    return date.slice(0, 4);
};

fetch('/data/pitchfork_dataset.json')
    .then((response) => response.json())
    .then((pitchfork_data) => {
        generate_scatter(pitchfork_data);

        pitchfork_data['pubYear'] = pitchfork_data['pubDate'].map(get_year);

        generate_box(pitchfork_data);
    });
