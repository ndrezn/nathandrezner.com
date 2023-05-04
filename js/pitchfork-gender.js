// Light/dark theme
const default_font = {
    color:
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'lightgray'
            : '#686867',
    family: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif;',
};

// Charts
const generate_scatter = (dataset, id) => {
    let scatter_chart = {
        data: [
            {
                x: dataset['pubDate'],
                y: dataset['rating'],
                text: dataset['hovertext'],
                customdata: dataset['url'],
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
            font: default_font,
        },
    };

    Plotly.newPlot(id, scatter_chart.data, scatter_chart.layout);

    // Add an event listener to the plotly_click event
    document.getElementById(id).on('plotly_click', function (data) {
        // Get the customdata array for the clicked point
        var customdata = data.points[0].customdata;
        // Open the hyperlink associated with the clicked point in a new tab
        window.open(customdata, '_blank');
    });
};

const generate_box = (dataset, id, x, xtitle) => {
    let box_chart = {
        data: [
            {
                x: dataset[x],
                y: dataset['rating'],
                text: dataset['hovertext'],
                customdata: dataset['url'],
                type: 'box',
                hovertemplate:
                    '%{text}<br><br>' +
                    '%{yaxis.title.text}: %{y}<br>' +
                    '%{xaxis.title.text}: %{x}<br>' +
                    '<extra></extra>',
            },
        ],
        layout: {
            font: default_font,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: {
                t: 30,
                b: x !== 'label' ? 30 : 80,
                l: 30,
                r: x !== 'label' ? 2 : 50,
            },
            hovermode: 'closest',
            xaxis: {
                title: xtitle,
                zeroline: false,
                tickangle: x !== 'label' ? null : 45,
            },
            yaxis: {
                title: 'Rating',
                zeroline: false,
            },
        },
    };

    Plotly.newPlot(id, box_chart.data, box_chart.layout);

    // Add an event listener to the plotly_click event
    document.getElementById(id).on('plotly_click', function (data) {
        // Get the customdata array for the clicked point
        if (data.points.length > 1) {
            return;
        }
        var customdata = data.points[0].customdata;
        // Open the hyperlink associated with the clicked point in a new tab
        console.log(data);
        window.open(customdata, '_blank');
    });
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
            font: default_font,
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

const generate_histogram = (dataset, id, group, barmode) => {
    // Better category labels
    if (group === 'bnm') {
        dataset['bnm_cat'] = dataset['bnm'].map((is_bnm) =>
            is_bnm ? 'BNM' : 'Standard'
        );
        group = 'bnm_cat';
    } else if (group === 'genres') {
        dataset['first_genre'] = dataset[group].map(
            (genres) => genres.split(', ')[0]
        );
        group = 'first_genre';
    }
    let scatter_chart = {
        data: [
            {
                x: dataset['rating'],
                type: 'histogram',
                text: dataset[group],
                opacity: barmode === 'overlay' ? 0.8 : 1,
                transforms: [
                    {
                        type: 'groupby',
                        groups: dataset[group],
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
            margin: {t: 30, b: 30, l: 50, r: 2},
            barmode: barmode,
            xaxis: {
                title: 'Score',
                zeroline: false,
            },
            yaxis: {
                title: 'Count',
                zeroline: false,
            },
            font: default_font,
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
function preprocess(dataset) {
    // Data transformations & additional columns
    dataset['hovertext'] = dataset['album'].map(
        (e, i) => '<i>' + e + '</i> (' + dataset['artist'][i] + ')'
    );
    dataset['pubYear'] = dataset['pubDate'].map((date, i) => date.slice(0, 4));

    dataset['url'] = dataset['url'].map((url) => 'https://pitchfork.com' + url);
    // For multi-reviews, just take the best score
    dataset['rating'] = dataset['rating'].map(getMax);

    return dataset;
}

fetch('/data/pitchfork_dataset.json')
    .then((response) => response.json())
    .then((pitchfork_data) => {
        // Generate our figures
        pitchfork_data = preprocess(pitchfork_data);
        generate_scatter(pitchfork_data, 'scatter-summary');

        generate_box(pitchfork_data, 'box-plot', 'pubYear', 'Review year');
        generate_stacked_bar(pitchfork_data, 'stacked-bar', 'artist_gender');
        generate_histogram(pitchfork_data, 'bnm-histogram', 'bnm', 'overlay');

        // By genre/label
        generate_histogram(pitchfork_data, 'genre-histogram', 'genres', null);

        // Best new music filtering
        const {bnm, ...rest} = pitchfork_data;
        let bnm_reviews = filterAll(bnm, rest, Boolean);

        // Best new music charts
        generate_box(bnm_reviews, 'bnm-box-plot', 'pubYear', 'Review year');
        generate_scatter(bnm_reviews, 'bnm-scatter-summary');
        generate_stacked_bar(bnm_reviews, 'bnm-stacked-bar', 'artist_gender');
        generate_stacked_bar(
            bnm_reviews,
            'bnm-stacked-bar-contributor',
            'author_title'
        );
    });

fetch('/data/popular_labels.json')
    .then((response) => response.json())
    .then((label_data) => {
        label_data = preprocess(label_data);

        generate_box(label_data, 'label-box-plot', 'label', 'Label');
    });
