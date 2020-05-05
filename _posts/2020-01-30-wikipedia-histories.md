---
layout: post
title: Wikipedia Histories
---

I've just released a project onto PyPi, [``wikipedia-histories``](https://pypi.org/project/wikipedia-histories/). I built it in Fall 2018 and I'm just releasing it now after restructuring it into a generalizable tool. After digging around for what felt like ages trying to find a way to scrape the content of previous revisions of Wikipedia articles, I ended up building my own program to complete the task, using several other Wikipedia parsers to help reach that end. 

[mwClient](https://pypi.org/project/mwclient/) allows simple scraping of the metadata of revisions, and the content of revisions is accessible from Wikipedia's API given an revision ID. Put those two together and it's possible to compile the list of revision IDs (and the metadata for those revisions) and get back a usable piece of text by passing it directly to Wikipedia. Unfortunately, that text comes back as raw HTML—which means it needs to be parsed into plain text. ```wikipedia-histories``` handles this and returns the data collected into an object.

The tool also collects the article rating at the time of each edit. Collecting the ratings for each version is a similar task to collecting the article history. First, the program scrapes the text of each revision to the talk page of the article (where quality markers are tagged by users), and once revisions are collected, uses the wonderfully named [mwparserfromhell](https://mwparserfromhell.readthedocs.io/en/latest/) to parse out the quality tag from the templates on each version of the talk page. Since edits are tagged by time, it's simple enough to relate the time of a quality tag changing to the time of an edit, and associate the quality tags from the talk pages to the edits on the main page.

Using the tool is really simple, as it has pretty much a single functionality: Getting an article and returning back its complete history. The data collected was used for my own research on Wikipedia, but I also hope the tool can be used for other projects and analyses. I feel like I've only touched the tip of the iceberg of what's possible.

Here's a simple example illustrating the functionality of ```wikipedia-histories``` using [golden swallow Wikipedia article](https://en.wikipedia.org/wiki/Golden_swallow).

```python
  >>> import wikipedia_histories
  
  # Generate a list of revisions for a specified page
  >>> golden_swallow = wikipedia_histories.get_history('Golden swallow')
  
  # Show the revision IDs for every edit
  >>> golden_swallow
  # [130805848, 162259515, 167233740, 195388442, ...
  
  # Show the user who made a specific edit
  >>> golden_swallow[16].user
  # u'Snowmanradio'
  
  # Show the text of at the time of a specific edit
  >>> golden_swallow[16].content
  # u'The Golden Swallow (Tachycineta euchrysea) is a swallow.
  #  The Golden Swallow formerly'...
  
  # Get the article rating at the time of the edit
  >>> ratings = [revision.rating for revision in golden_swallow]
  >>> ratings
  # ['NA', 'NA', 'NA', 'NA', 'stub', 'stub', ...
```
