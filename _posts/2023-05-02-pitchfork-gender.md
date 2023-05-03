---
layout: post
title: Pitchfork Gender
---

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

Words words words

<div id='scatter-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Every review ever given by Pitchfork -- select specific categories by clicking on the key on the right, and hover on points to see more information.</small></div>

<div id='box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Year-by-year score aggregations. Fewer extreme low scores are given out over time, and the middle 50% of scores narrows from a span of 1.8 to 0.7. The real average hovers closer to 7.4, not <a href='https://www.theonion.com/pitchfork-gives-music-6-8-1819569318'><i>The Onion</i>'s 6.8.</a></small></div>

<div id='stacked-bar' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Count of reviews over year, grouped by gender. Pitchfork has been surprisingly consistent in its editorial output since its inception, and there are far more women artists represented over time.</small></div>

<div id='bnm-scatter-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >All Best New Music reviews.</small></div>

<div id='bnm-box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Aggregating the scores for best new music reviews.</small></div>

<div id='bnm-stacked-bar' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Best new music reviews as grouped by artist gender and count.</small></div>

<div id='bnm-stacked-bar-contributor' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Does the contributor's title play a role in whether they have a BNM byline?</small></div>

<script type='module' src='/js/pitchfork-gender.js'></script>
