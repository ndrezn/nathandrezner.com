---
layout: post
title: Running Python in the browser
---

Executing Python code in a browser environment is emerging as a core part of the toolkit powering recent developments in the web space for Python, including Jupyter alternatives like [Marimo](https://marimo.io).  I'm really excited about this tooling, and wanted to dive in and see what kinds of things I could spin up in a weekend.

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/theme/material-darker.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/theme/mdn-like.min.css">

<script src="/js/plotly_themes.js"></script>
<script src="/js/pyodide_demo.js"></script>

Today's toolkit for Python running natively in a browser is fantastic. I've put together a toy cell-like interpreter using Pyodide, Codemirror, and some custom rendering, which, taken together, sure look and feel like a traditional, desktop-based Python interpreter.

The catch is, there's no server backing this environment: Everything is running natively in your browser using WebAssembly.

{% include code_component.html
id_prefix="demo1"
code="print('Hello, WASM!')

# Try writing & running some Python!"
%}

[Pyodide](https://pyodide.org/en/stable/) is a Python distribution for the browser based on WASM. It lets developers load a Python interpreter into a Node project or directly from a CDN; it's special because it runs without needing a backend. This mitigates the many risks (and complexities) of opening up a Python environment which allows end users to execute arbitrary code server side. It also makes it perfect to bake into a static site like my blog.

Pyodide has been around for some time now. It emerged out of Mozilla in 2018 as the engine for [Iodide](https://github.com/iodide-project/iodide),  a web-based notebook environment. There's been plenty of sideline chatter about it in the years since. In 2022, my former colleague at Plotly, Xing Han Lu, published [a fantastic blog](https://t.co/grzgu8NlDH) about the power of Pyodide in web development, and I expect plenty of new tooling to emerge powered by Pyodide in the near future: Its ease of use makes it a great tool for folks of just about any level of development skill to at least start driving it around.

At its most basic, a Pyodide-powered interpreter a great pedagogical tool for documentation and live examples. I'd love to see more Python package documentation adopt live interfaces for code examples using Pyodide. 

{% include code_component.html
id_prefix="quicksort"
code="import random


def quicksort(arr):
    if len(arr) &lt;= 1:
        return arr
    else:
        pivot = arr[len(arr) // 2]
        left = [x for x in arr if x &lt; pivot]
        middle = [x for x in arr if x == pivot]
        right = [x for x in arr if x &gt; pivot]
        return quicksort(left) + middle + quicksort(right)


array = random.sample(range(1, 51), 10)
print('Unsorted array:', array)

sorted_array = quicksort(array)
print('Sorted array:', sorted_array)"
%}

So how does this interpreter UI work?

We take in the user's code as input, and Pyodide gives us an execution environment for that code. We can generate a custom output based on what's returned from that execution environment: In our case, I'm capturing the `stdout` and piping it to a `pre` component.

We can take this a step further by building a custom renderer for specific outputs.

{% include code_component.html
id_prefix="px-scatter"
code="import plotly.express as px

df = px.data.iris()

fig = px.scatter(
    df,
    x=&quot;sepal_width&quot;,
    y=&quot;sepal_length&quot;,
    color=&quot;species&quot;,
    size=&quot;petal_length&quot;,
    hover_data=[&quot;petal_width&quot;],
)

fig.show()"
%}

In this case, I built Plotly-specific handler, but it doesn't seem unreasonable to build a generalized toolkit (think wiring in something like [AnyWidget](https://anywidget.dev/en/getting-started/) as the output mechanism). 

Try toying around with the value for `N` to see what happens when you attempt to plot hundreds of thousands of points in a chart:

{% include code_component.html
    id_prefix="demo3"
    code="import plotly.graph_objects as go
import numpy as np

N = 100000 # Try changing this value

fig = go.Figure(data=go.Scattergl(
    x = np.random.randn(N),
    y = np.random.randn(N),
    mode='markers',
    marker=dict(
        color=np.random.randn(N),
        colorscale='Viridis',
        line_width=1
    )
))

fig.show()"
%}

Loading up Pyodide does take a second or two (you'll notice if you refresh), as does loading in any dependencies. To help with dependency management, Pyodide offers the `micropip` package which allows developers to asynchronously load in any Python dependencies: In this demonstration, I'm manually loading in `plotly` and `pandas`, but `micropip` only supports packages that do not have any compiled code, which excludes packages like `tensorflow` , but some popular packages in this class, like `numpy`, have pre-built wheels provided by Pyodide.

In this demonstration, I don't have any UI exposing `micropip`, but it would be fairly straightforward to implement, which would allow users to add arbitrary packages to their environment. (It's also possible to run `micropip.install` in the interpreter.)

An obvious advantage of using Pyodide is you have access to the Python suite inside your web app -- for example, let's improve this cell editor by adding a formatter. 

{% include code_component.html
    id_prefix="formatter"
    enable_format_button=true
    code="x=10
y  =   20
z=   30

def add (a,b):
    return a+b

def   multiply(a,b):
 return a*b

result1=add(x,y)
result2 =multiply(y,z)

print ('Addition result:', result1)
print('Multiplication result:', result2)

if x<y   and y<z:
    print('x is less than y is less than z')
else:
        print('The condition is not true')

list_comp=[i    for i in range(5)if i%2==0]
print('Even numbers:', list_comp)"
%}

This formatter runs using `black`, executing in the WASM Python environment, and updates the editor component in place. While a Python formatter is quite specific, making Python tooling available to frontend is very powerful: Some of the best data processing tooling is built with Python APIs, and interacting with those APIs while avoiding the burden of hosting everything on a heavy, expensive server is a great solution for many tasks.

There are still plenty of open questions: Big data and secrets management both are still better solved with a served framework (and this is where tools like [Dash](dash.plotly.com) come into play), but it'll be very interesting to watch how WASM-based Python tooling (and any associated user interfaces, plugins, and more) evolve over time.

*The source for this blog post can be found [on my GitHub](https://github.com/ndrezn/nathandrezner.com/pull/18).*