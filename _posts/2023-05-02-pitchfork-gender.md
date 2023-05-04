---
layout: post
title: Pitchfork Gender
---

Artist gender is determined based on pronouns used in the lede of the article.

<div id='scatter-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Every review ever given by Pitchfork -- select specific categories by clicking on the key on the right, and hover on points to see more information. In the case of multi-reviews with multiple scores, we're taking the highest individual score. Click on points to jump to that review.</small></div>

<div id='box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Year-by-year score aggregations. Fewer extreme low scores are given out over time, and the middle 50% of scores narrows from a span of 1.8 to 0.7. The real average hovers closer to 7.4, not <a href='https://www.theonion.com/pitchfork-gives-music-6-8-1819569318'><i>The Onion</i>'s 6.8</a>. </small></div>

<div id='bnm-histogram' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Distribution of ratings for all Best New Music and non-Best New Music reviews. There are disporportionate peaks on whole numbers: This effect materializes the worst at 7.0 and 8.0. Reminds me of peaks by gender for <a href='https://twitter.com/alexselbyb/status/1650101850782179333'>marathon finish times</a>.</small></div>

<div id='stacked-bar' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Count of reviews over year, grouped by gender. Pitchfork has been surprisingly consistent in its editorial output since its inception, and there are far more women artists represented over time.</small></div>

<div id='genre-histogram' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >How do genre rating distributions stack up?</small></div>

<div id='label-box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Comparing rating spread for labels with who have distributed more than 100 reviewed albums.</small></div>
## Best New Music

<div id='bnm-scatter-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >All Best New Music reviews.</small></div>

<div id='bnm-box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Aggregating the scores for best new music reviews.</small></div>

<div id='bnm-stacked-bar' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Best new music reviews as grouped by artist gender and count.</small></div>

<div id='bnm-stacked-bar-contributor' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Does the contributor's title play a role in whether they have a BNM byline?</small></div>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://cdn.plot.ly/plotly-2.20.0.min.js" charset="utf-8"></script>
<script type='module' src='/js/pitchfork-gender.js'></script>
