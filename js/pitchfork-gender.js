// Charts

const generate_scatter = (dataset, id) => {
    let scatter_chart = {
        data: [
            {
                x: dataset['pubDate'],
                y: dataset['rating'],
                text: dataset['hovertext'],
                mode: 'markers',
                type: 'scattergl',
                transforms: [
                    {
                        type: 'groupby',
                        groups: dataset['artist_gender'],
                    },
                ],
                hovertemplate:
                    '%{text}<br><br>' +
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
                title: 'Rating',
                zeroline: false,
            },
        },
    };

    Plotly.newPlot(id, scatter_chart.data, scatter_chart.layout);
};

const generate_box = (dataset, id) => {
    let box_chart = {
        data: [
            {
                x: dataset['pubYear'],
                y: dataset['rating'],
                text: dataset['hovertext'],
                type: 'box',
                hovertemplate:
                    '%{text}<br><br>' +
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
                title: 'Rating',
                zeroline: false,
            },
        },
    };

    Plotly.newPlot(id, box_chart.data, box_chart.layout);
};

const generate_stacked_bar = (dataset, id, groupby_column) => {
    let chart = {
        data: [
            {
                x: dataset['pubYear'],
                y: dataset['rating'],
                type: 'bar',
                text: dataset[groupby_column],
                hovertemplate:
                    '%{text}<br><br>' +
                    '%{yaxis.title.text}: %{y}<br>' +
                    '%{xaxis.title.text}: %{x}<br>' +
                    '<extra></extra>',
                transforms: [
                    {
                        type: 'aggregate',
                        groups: dataset['pubYear'],
                        aggregations: [{target: 'y', func: 'count'}],
                    },
                    {
                        type: 'groupby',
                        groups: dataset[groupby_column],
                    },
                ],
            },
        ],
        layout: {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: {t: 30, b: 30, l: 50, r: 2},
            hovermode: 'closest',
            barmode: 'stack',
            xaxis: {
                title: 'Review year',
                zeroline: false,
            },
            yaxis: {
                title: 'Count',
                zeroline: false,
            },
        },
    };

    Plotly.newPlot(id, chart.data, chart.layout);
};

const generate_histogram = (dataset, id) => {
    // Better category labels
    dataset['bnm'] = dataset['bnm'].map((is_bnm) =>
        is_bnm ? 'BNM' : 'Standard'
    );
    let scatter_chart = {
        data: [
            {
                x: dataset['rating'],
                type: 'histogram',
                opacity: 0.8,
                transforms: [
                    {
                        type: 'groupby',
                        groups: dataset['bnm'],
                    },
                ],
                hovertemplate:
                    '%{yaxis.title.text}: %{y}<br>' +
                    '%{xaxis.title.text}: %{x}<br>' +
                    '<extra></extra>',
            },
        ],
        layout: {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: {t: 30, b: 30, l: 50, r: 2},
            barmode: 'overlay',
            xaxis: {
                title: 'Score',
                zeroline: false,
            },
            yaxis: {
                title: 'Count',
                zeroline: false,
            },
        },
    };

    Plotly.newPlot(id, scatter_chart.data, scatter_chart.layout);
};

// Helpers
function getMax(str) {
    let max;
    if (str !== 'unknown') {
        const nums = str.match(/\d+(\.\d+)?/g).map(Number);
        max = Math.max.apply(null, nums);
    } else {
        max = null;
    }
    return max;
}

function filterAll(filterCol, dataset, condition) {
    let filtered_dataset = Object.keys(dataset).reduce(
        (acc, key) => ({...acc, [key]: []}),
        {}
    );
    for (let i = 0; i < filterCol.length; i++) {
        if (condition(filterCol[i])) {
            for (let key in dataset) {
                filtered_dataset[key].push(dataset[key][i]);
            }
        }
    }

    return filtered_dataset;
}

fetch('/data/pitchfork_dataset.json')
    .then((response) => response.json())
    .then((pitchfork_data) => {
        // Data transformations & additional columns
        pitchfork_data['hovertext'] = pitchfork_data['album'].map(
            (e, i) => '<i>' + e + '</i> (' + pitchfork_data['artist'][i] + ')'
        );
        pitchfork_data['pubYear'] = pitchfork_data['pubDate'].map((date, i) =>
            date.slice(0, 4)
        );
        // For multi-reviews, just take the best score
        pitchfork_data['rating'] = pitchfork_data['rating'].map(getMax);

        // Generate our figures
        generate_scatter(pitchfork_data, 'scatter-summary');
        generate_box(pitchfork_data, 'box-plot');
        generate_stacked_bar(pitchfork_data, 'stacked-bar', 'artist_gender');
        generate_histogram(pitchfork_data, 'histogram');

        // Best new music filtering
        const {bnm, ...rest} = pitchfork_data;
        let bnm_reviews = filterAll(bnm, rest, Boolean);

        // Best new music charts
        generate_box(bnm_reviews, 'bnm-box-plot');
        generate_scatter(bnm_reviews, 'bnm-scatter-summary');
        generate_stacked_bar(bnm_reviews, 'bnm-stacked-bar', 'artist_gender');
        generate_stacked_bar(
            bnm_reviews,
            'bnm-stacked-bar-contributor',
            'author_title'
        );
    });
