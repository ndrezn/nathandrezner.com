---
layout: post
title: Digging around the Pitchfork archives
---

I've been sitting on this dataset for a while now -- I originally put it together about two years ago, set it aside, and didn't take the time to come back to it. I'm motivated in part from a technical perspective (I've wanted to do a project using `plotly.js` for a while now) and as a general curiosity: I find _Pitchfork_ to be a fantastic resource. _Pitchfork_ is an excellent stopping point for reviews on nearly any record released, it's a great tool for music discovery, and of course it's famous for [taking digs](https://www.youtube.com/watch?v=t1Wk3H5Xur0) and publishing hot takes, for better or for worse.

It's also an excellent trove of information for data analysis. More than 20 years of music reviews, all scored with the same 100-point scale, tagged by genre, awarded superlatives like "Best New Music" (reflecting a real-time "best of the year" list), and more. Why not run some analytics on it?

<div id='scatter-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Every review ever given by Pitchfork -- select specific categories by clicking on the key on the right, and hover on points to see more information. In the case of multi-reviews with multiple scores, we're taking the highest individual score. Click on points to jump to that review.</small></div>

So: Here are a ton of figures, some analysis, and more. Zoom, pan, and hover to your heart's content -- click on the points to read the reviews (They're good! Enjoy them!). See if you uncover any interesting tidbits.

One aspect I was particularly curious about when starting this project was how artist gender plays into ratings and reviews. Articles _are not_ officially tagged with the artist's gender: For the purposes of this project, I am using the fairly rudimentary method of checking which pronouns are used in the article lede (Pheobe Bridger's _Punisher_ review opens with, "On her marvelous second album, Phoebe Bridgers defines her songwriting: candid, multi-dimensional, slyly psychedelic, and full of heart. Her music has become a world unto itself." -- so the data collector will pick up on the multiple _her_ pronouns and assign the artist gender as "female". Likewise with male ("he", "him", etc.), neutral ("they", "them", etc.) and group ("band", "group", etc.) pronouns.)

Does Pitchfork play any sides disporportionately? Are specific genres over or underrepresented? How have women fared in the review process? Largely, I found Pitchfork surprisingly consistent in their editorial voice, with some exceptions. There is an increase in reviews of women artists over time and the spread of scores has shrunk significantly over time. There are also, of course, some human tendencies that seep through into the reviews: There are spikes in the distribution of 8.0s assigned compared to 8.1s and 7.9s -- the same is true for all whole number scores -- and yes, pop-oriented labels do tend to have poorer reviews.

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
