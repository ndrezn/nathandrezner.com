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
