// Light/dark theme
const default_font = {
    color:
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'lightgray'
            : '#686867',
    family: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif;',
};

const colorway = [
    '#00b4ff',
    '#ff9222',
    '#3949ab',
    '#ff5267',
    '#08bdba',
    '#fdc935',
    '#689f38',
    '#976fd1',
    '#f781bf',
    '#52733e',
];

function transformData(data, groupByColumn) {
    let transformedData = [];
    for (let i = 0; i < data.pubDate.length; i++) {
        let pubMonthTime = new Date(data.pubDate[i]);
        pubMonthTime.setFullYear(1970);    
        transformedData.push({
            pubDate: data.pubDate[i],
            grouper: data[groupByColumn][i],
            rating: data.rating[i],
            date: new Date(data.pubDate[i]),
            pubYear: data.pubYear[i],
            pubMonthTime: pubMonthTime,
        });
    }
    return transformedData;
}

function calculateRollingAverage(data, windowSize) {
    let rollingAvg = new Array(data.length);

    for (let i = 0; i < windowSize - 1; i++) {
        rollingAvg[i] = null; // Fill initial elements with null or an appropriate placeholder
    }

    for (let i = windowSize - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = i - windowSize + 1; j <= i; j++) {
            sum += data[j];
        }
        rollingAvg[i] = sum / windowSize;
    }

    return rollingAvg;
}

// Generate a timeseries chart with various grouping capabilitie
// and using a rolling average for smoothing ratings over time
function generate_timeseries(
    data,
    divId,
    groupByColumn,
    useGlobalAverage = true,
    yearRange = [],
    windowSize = 150,
    stackYears = false
) {
    let transformedData = transformData(data, groupByColumn);

    let groupValues = Array.from(
        new Set(transformedData.map((item) => item['grouper']))
    );
    let traces = [];

    // Global rolling average
    let globalSortedData = transformedData.sort(
        (a, b) => new Date(a.pubDate) - new Date(b.pubDate)
    );
    let globalRatings = globalSortedData.map((item) => item.rating);
    let globalRollingAvg = calculateRollingAverage(globalRatings, windowSize);
    globalSortedData.forEach((item, index) => {
        item.globalRollingAvg = globalRollingAvg[index];
    });

    if (yearRange.length > 0) {
        transformedData = transformedData.filter((item) => {
            return item.pubYear >= yearRange[0] && item.pubYear <= yearRange[1];
        });
    }

    groupValues.forEach((groupValue) => {
        // calculate local rolling average
        let filteredData = transformedData.filter(
            (item) => item.grouper === groupValue
        );
        let sortedData = filteredData.sort(
            (a, b) => new Date(a.pubDate) - new Date(b.pubDate)
        );
        let rollingAvg;
        if (!useGlobalAverage) {
            let ratings = sortedData.map((item) => item.rating);
            rollingAvg = calculateRollingAverage(ratings, windowSize);
        } else {
            rollingAvg = sortedData.map((item) => item.globalRollingAvg);
        }
        traces.push({
            x: sortedData.map((item) => stackYears ? item.pubMonthTime : item.pubDate),
            y: rollingAvg,
            type: 'scatter',
            mode: 'lines',
            name: groupValue.toString(), // Convert to string for consistency
        });
    });

    Plotly.newPlot(divId, traces, {
        title: `Grouped by ${groupByColumn}, ${windowSize}-day rolling average`,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: {t: 30, b: 30, l: 30, r: 2},
        hovermode: 'x unified',
        xaxis: {
            title: 'Review date',
            zeroline: false,
        },
        yaxis: {
            title: 'Rating',
            zeroline: false,
        },
        font: default_font,
        colorway: colorway,
    });
}

const generate_3d_scatter = (dataset, id, projection) => {
    let scatter3d_chart = {
        data: [
            {
                x: dataset['pubYear'],
                y: dataset['rating'],
                z: dataset['zIndex'],
                text: dataset['hovertext'],
                customdata: dataset['url'],
                mode: 'markers',
                type: 'scatter3d',
                transforms: [
                    {
                        type: 'groupby',
                        groups: dataset['artist_gender'],
                    },
                ],
                marker: {
                    size: 2.1,
                },
                hovertemplate:
                    '%{text}<br>' +
                    'Year: %{x}<br>' +
                    'Score: %{y}<br>' +
                    'Count: %{z}<br>' +
                    '<extra></extra>',
            },
        ],
        layout: {
            uirevision: true,
            scene: {
                xaxis: {title: 'Year'},
                yaxis: {title: 'Score'},
                zaxis: {title: 'Count'},
                camera: {
                    eye: {x: 0, y: 0, z: 1.5},
                    up: {x: 0, y: 1, z: 0},
                    projection: {type: projection},
                },
            },
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
            colorway: colorway,
        },
    };

    Plotly.newPlot(id, scatter3d_chart.data, scatter3d_chart.layout);
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
            colorway: colorway,
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
            colorway: colorway,
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
            colorway: colorway,
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
            colorway: colorway,
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

    let scoreYearCounts = {};

    dataset['zIndex'] = new Array(dataset['rating'].length).fill(0);

    dataset['rating'].forEach((score, index) => {
        let year = dataset['pubYear'][index];

        if (!scoreYearCounts[year]) {
            scoreYearCounts[year] = {};
        }
        if (!scoreYearCounts[year][score]) {
            scoreYearCounts[year][score] = 0;
        }

        dataset['zIndex'][index] = ++scoreYearCounts[year][score];
    });

    return dataset;
}

fetch('/data/pitchfork_dataset.json')
    .then((response) => response.json())
    .then((raw) => {
        // Generate our figures
        const pitchfork_data = preprocess(raw);
        generate_3d_scatter(pitchfork_data, 'scatter-3d', 'perspective');
        // Event listener for radio buttons
        document
            .querySelectorAll('input[name="viewType"]')
            .forEach(function (radio) {
                radio.addEventListener('change', function () {
                    generate_3d_scatter(
                        pitchfork_data,
                        'scatter-3d',
                        this.value
                    );
                });
            });

        generate_scatter(pitchfork_data, 'scatter-summary');

        generate_timeseries(pitchfork_data, 'timeseries-summary', 'bnm', false);
        generate_timeseries(
            pitchfork_data,
            'timeseries-by-year',
            'pubYear',
            true,
            [2020, 2050],
            150,
            true
        );

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
