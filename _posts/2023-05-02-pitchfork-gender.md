---
layout: post
title: Digging around the Pitchfork archives
---

I've been sitting on this dataset for a while now -- I originally put it together about two years ago, set it aside, and didn't take the time to come back to it. I'm motivated in part from a technical perspective (I've wanted to do a project using `plotly.js` for a while now) and as a general curiosity: I find _Pitchfork_ to be a fantastic resource. _Pitchfork_ is an excellent stopping point for reviews on nearly any record released, it's a great tool for music discovery, and of course it's famous for [taking digs](https://www.youtube.com/watch?v=t1Wk3H5Xur0) and publishing hot takes, for better or for worse.

It's also an excellent trove of information for data analysis. More than 20 years of music reviews, all scored with the same 100-point scale, tagged by genre, awarded superlatives like "Best New Music" (reflecting a real-time "best of the year" list), and more. Why not run some analytics on it?

<div id='scatter-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Every review ever given by Pitchfork -- select specific categories by clicking on the key on the right, and hover on points to see more information. <i>Click a point to jump to the review.</i></small></div>

So: Here are a ton of figures, some analysis, and more. Zoom, pan, and hover to your heart's content -- click on the points to read the reviews (They're good! Enjoy them!). See if you uncover any interesting tidbits.

<div id='scatter-3d' style='min-height: 700px'></div>
<div>
    <label><input type="radio" name="viewType" value="perspective" checked>Perspective</label>
    <label><input type="radio" name="viewType" value="orthographic">Orthographic</label>
</div>
<div style="text-align:center; margin: 0 auto;"><small >The same chart, grouped by year and spread into an extra plane given the count of a score in a given year. Try rotating.</small></div>

One aspect I was particularly curious about when starting this project was how artist gender plays into ratings and reviews. Articles _are not_ officially tagged with the artist's gender: For the purposes of this project, I am using the fairly rudimentary method of checking which pronouns are used in the article lede (Pheobe Bridger's _Punisher_ review opens with, "On her marvelous second album, Phoebe Bridgers defines her songwriting: candid, multi-dimensional, slyly psychedelic, and full of heart. Her music has become a world unto itself." -- so the data collector will pick up on the multiple _her_ pronouns and assign the artist gender as "female". Likewise with male ("he", "him", etc.), neutral ("they", "them", etc.) and group ("band", "group", etc.) pronouns.)

Does Pitchfork play any sides disproportionately? Are specific genres over or underrepresented? How have women fared in the review process? Largely, I found Pitchfork surprisingly consistent in their editorial voice, with some exceptions. There is an increase in reviews of women artists over time and the spread of scores has shrunk significantly over time. There are also, of course, some human tendencies that seep through into the reviews: There are spikes in the distribution of 8.0s assigned compared to 8.1s and 7.9s -- the same is true for all whole number scores -- and yes, pop-oriented labels do tend to have poorer reviews.

<div id='timeseries-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Comparison of reviews over time,using a rolling average for point-in-time specificity. You can get a sense of how the average review shifts as time goes on -- Best New Music slowly centers on 8.5.</small></div>

When we look at reviews over time using a rolling average, you can see more patterns: Over time, Best New Music averages slowly centers towards 8.5, with a decreasing trend. There are also notable local minimums and maximums -- we can pinpoint where these are by focusing in on each year.

We also can see that music *on average* is getting better -- or, the best music is getting worse, while music in general is getting better. This is just as likely meta-commentary on Pitchfork's editorial practice: As the publication becomes more mainstream, outliers tend to decrease, and more music in general is given higher scores. We'll see more of this later.

<div id='timeseries-by-year' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Comparing by year suggests that music is at its worst in late summer, and at its best in late spring and the end of the year.</small></div>
If we look at the rolling average and compare across years, an interesting pattern emerges: Year over year, we see peaks in ratings in late spring and at the end of the year (November and December), and valleys at the end of the summer.

Music release timing is specified towards specific markets, with a large number of releases in late spring for summer listening and in late summer, during back-to-school season [CITATION NEEDED]. Maybe the best music is launched for a general demographic in the summer, and the rest is saved for students, who are less picky (?????) I have no idea how to read this....

<div id='box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Year-by-year score aggregations. Fewer extreme low scores are given out over time, and the middle 50% of scores narrows from a span of 1.8 to 0.7. The real average hovers closer to 7.4, not <a href='https://www.theonion.com/pitchfork-gives-music-6-8-1819569318'><i>The Onion</i>'s 6.8</a>. </small></div>

Publications mature over time -- and _Pitchfork_ is no exception -- and of course, editorial practices shift over time as well. Here, it's clear that there is some increasing trend in average scores over time from low 7's to the current, and consistent, 7.4 with a much smaller deviation. In the early days of _Pitchfork_, there are also far more outliers on the lower bounds -- a healthy dose of 0's (like for [Jet's _Shine On_](https://pitchfork.com/reviews/albums/9464-shine-on/), or the poorly aged review for [Liz Phair's self-titled debut](https://pitchfork.com/reviews/albums/6255-liz-phair/)). Today, there are far fewer extremes. Most likely this is just a result of changing ideals at the publication over time, with increased readership leading to fewer published hardball reviews.

<div id='bnm-histogram' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Distribution of ratings for all Best New Music and non-Best New Music reviews. There are disporportionate peaks on whole numbers: This effect materializes the worst at 7.0 and 8.0. Reminds me of peaks by gender for <a href='https://twitter.com/alexselbyb/status/1650101850782179333'>marathon finish times</a>.</small></div>

Reviews are distributed fairly normally. Notably, there are spikes on whole-number reviews, probably because of a human tendency to just round off. There are also a disproportionate number of 8.0 reviews -- notably, most of these are not marked as "Best New Music" -- in fact, only 7 BNM reviews have scores falling at an 8.0 or lower. Once a review notches past an 8.0, its marginally more likely to be marked as a BNM than as a standard review (plausibly this is related to the inclusion of reviews of reissues or backcatalog records in this dataset).

<div id='stacked-bar' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Count of reviews over year, grouped by gender. Pitchfork has been surprisingly consistent in its editorial output since its inception, and there are far more women artists represented over time.</small></div>

Observing a comparison of count between reviews, I was first amazed at the consistency in the number of reviews published year-over-year. _Pitchfork_ has published between 1,000 and 1,250 reviews every year since 2003. Even as more people have started reading, the quantity of reviews hasn't changed.

If we compare by gender, there clearly is an increase in the number of reviews of women artists -- but there's also an increase in the number of reviews of male artists. So, plausibly, _Pitchfork_ is just using pronouns more liberally in their reviews.

<div id='genre-histogram' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >How do genre rating distributions stack up?</small></div>


<div id='label-box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Comparing rating spread for labels with who have distributed more than 100 reviewed albums.</small></div>
## Best New Music
Best New Music is a superlative given to the best "point in time" release by Pitchfork. As an early digital publication, it could [uniquely publish](https://pitchfork.com/features/lists-and-guides/the-history-of-the-pitchfork-reviews-section-in-38-important-reviews/) a best-of-the-year list in real-time, rather than waiting until year end for official rankings: The first was given to Deerhoof's *Apple O'* in 2003. (Pitchfork also had poor search capabilities early on, so they wanted to consolidate all of their favorite albums onto a single page.) Here, we can take a closer look at the complete set of Best New Music albums -- all of those records which which reflect Pitchfork's core recommendations. 

<div id='bnm-scatter-summary' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >All Best New Music reviews. Click on a point to jump to the review, or click traces from the legend to isolate them.</small></div>

Best New Music encompasses not just new albums, but also reissues -- so you may see some albums that were released far earlier than their review date. Only one album has been given both a Best New Music superlative and a score lower than 8.0 -- 2003's  _Let's Get Serious EP_ by PANTHERS. 

<div id='bnm-box-plot' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Aggregating the scores for best new music reviews. As in the rolling average plot above, we can see that BNM review scores are slowly decreasing towards 8.5.</small></div>

<div id='bnm-stacked-bar' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Best new music reviews as grouped by artist gender and count. We see a similar distribution by gender as across all reviews.</small></div>

When we compare by gender, we can see that 

<div id='bnm-stacked-bar-contributor' style='min-height: 500px'></div>
<div style="text-align:center; margin: 0 auto;"><small >Does the contributor's title play a role in whether they have a BNM byline?</small></div>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://cdn.plot.ly/plotly-2.20.0.min.js" charset="utf-8"></script>
<script type='module' src='/js/pitchfork-gender.js'></script>
