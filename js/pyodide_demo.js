let pyodideInstance = null;

async function initializePyodide() {
    if (pyodideInstance) {
        return pyodideInstance;
    }

    pyodideInstance = await loadPyodide();
    await pyodideInstance.loadPackage('micropip');
    await pyodideInstance.runPythonAsync(`
        import micropip
        await micropip.install('plotly')
        await micropip.install('pandas')
    `);
    return pyodideInstance;
}

async function initializeEditors() {
    const components = document.querySelectorAll('.code-component');
    const editors = [];

    components.forEach(function (component) {
        const idPrefix = component.getAttribute('data-id-prefix');
        const codeEditor = document.getElementById(`${idPrefix}-code-editor`);
        const runButton = document.getElementById(`${idPrefix}-run-button`);
        const formatButton = document.getElementById(
            `${idPrefix}-format-button`
        );
        const output = document.getElementById(`${idPrefix}-output`);
        const plotDiv = document.getElementById(`${idPrefix}-plot`);

        const editor = CodeMirror.fromTextArea(codeEditor, {
            mode: 'python',
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'material-darker'
                : 'mdn-like',
            lineNumbers: true,
        });

        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (event) => {
                editor.setOption(
                    'theme',
                    event.matches ? 'material-darker' : 'mdn-like'
                );
            });

        editors.push({
            editor,
            runButton,
            formatButton,
            output,
            plotDiv,
        });
    });

    return editors;
}

async function formatCode(pyodide, code) {

    pyodide.loadPackage('black')
    await pyodideInstance.runPythonAsync(`
        import micropip
        await micropip.install('black')
    `);
    try {
        const formattedCode = await pyodide.runPythonAsync(`
import black

input_code = '''${code}'''
formatted = black.format_str(input_code, mode=black.Mode())
formatted
        `);
        return formattedCode;
    } catch (err) {
        console.error('Error formatting code:', err);
        return code;  // Return original code if formatting fails
    }
}

async function main() {
    await load_scripts();
    const [pyodide, editors] = await Promise.all([
        initializePyodide(),
        initializeEditors(),
    ]);

    editors.forEach(({ editor, runButton, formatButton, output, plotDiv }) => {
        runButton.disabled = false;
        formatButton.disabled = false;

        runButton.addEventListener('click', async () => {
            const code = editor.getValue();
            try {
                const result = await pyodide.runPythonAsync(`
import plotly.io as pio
import json
import sys
from io import StringIO

old_stdout = sys.stdout
sys.stdout = StringIO()

def custom_show(self, *args, **kwargs):
    fig_json = pio.to_json(self)
    print(fig_json)
    return fig_json

import plotly.graph_objs._figure as figure
figure.Figure.show = custom_show

exec('''${code}''')

output = sys.stdout.getvalue()
sys.stdout = old_stdout
output
                `);

                const jsonMatch = result.match(/({.*})/g);
                const lastJsonString = jsonMatch
                    ? jsonMatch[jsonMatch.length - 1]
                    : null;

                if (lastJsonString) {
                    let plotData = JSON.parse(lastJsonString);

                    // Style overrides
                    plotData.layout.paper_bgcolor = 'rgba(0,0,0,0)';
                    plotData.layout.plot_bgcolor = 'rgba(0,0,0,0)';
                    plotData.layout.colorway = colorway;
                    plotData.layout.font = default_font;
                    plotData.layout.margin = { t: 30, b: 30, l: 30, r: 2 };

                    plotData.layout.xaxis = {
                        zeroline: false,
                    };
                    plotData.layout.yaxis = {
                        zeroline: false,
                    };

                    Plotly.newPlot(plotDiv, plotData.data, plotData.layout);

                } else {
                    output.textContent = result || 'No output';
                    plotDiv.innerHTML = '';
                }
            } catch (err) {
                output.textContent = err;
                plotDiv.innerHTML = '';
            }
        });

        formatButton.addEventListener('click', async () => {
            const code = editor.getValue();
            const formattedCode = await formatCode(pyodide, code);
            editor.setValue(formattedCode);
        });

        // Execute cells by default
        runButton.click();
    });
}

async function load_scripts() {
    const scripts = [
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/python/python.min.js',
        'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js',
        'https://cdn.plot.ly/plotly-2.20.0.min.js',
    ];

    for (const src of scripts) {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

document.addEventListener('DOMContentLoaded', main);