const generate_scatter = (dataset, id) => {
    let scatter_chart = {
        data: [
            {
                x: dataset['pubDate'],
                y: dataset['rating'],
                text: dataset['hovertext'],
                mode: 'markers',
                type: 'scatter',
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
                text: dataset['artist_gender'],
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

function getAverage(str) {
    const nums = str.match(/\d+(\.\d+)?/g).map(Number);
    const sum = nums.reduce((acc, val) => acc + val, 0);
    const avg = sum / nums.length;
    return avg;
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

        // Generate our figures
        generate_scatter(pitchfork_data, 'scatter-summary');
        generate_box(pitchfork_data, 'box-plot');
        generate_stacked_bar(pitchfork_data, 'stacked-bar', 'artist_gender');

        // best new music
        const {bnm, ...rest} = pitchfork_data;
        let bnm_reviews = filterAll(bnm, rest, Boolean);
        console.log(bnm_reviews.length);

        bnm_reviews['rating'] = bnm_reviews['rating'].map(getAverage);
        generate_box(bnm_reviews, 'bnm-box-plot');
        generate_scatter(bnm_reviews, 'bnm-scatter-summary');

        generate_stacked_bar(bnm_reviews, 'bnm-stacked-bar', 'artist_gender');
        generate_stacked_bar(
            bnm_reviews,
            'bnm-stacked-bar-contributor',
            'author_title'
        );
    });
