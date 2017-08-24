## Static Projects

Repository for for [KPCC](http://www.scpr.org/) [static projects](http://projects.scpr.org/).

Deploys to <http://projects.scpr.org/static>.

### Deployment

<del>* You'll need your SSH key installed in authorized_keys for user `archive` on media, and on dev2 if you want to deploy to staging.</del>

<del>* Make sure you have the `capistrano` rubygem installed. For more information, see <https://rubygems.org/gems/capistrano>.</del>

<del>From the root of this repository, run the follow commands to deploy to:

**Production** (media):

    cap deploy

**Staging** (dev2):

    cap staging deploy

Once deployed, files will be immediately available to the public at the same paths as are setup in this project. Note that *EVERY* file will be available for viewing/download.</del>

### Paths

nginx passes off any requests to `/static` to this repository, so
the directory/file structure is taken literally. nginx's `autoindex`
module is turned ON, so requests to directories will be automatically
resolved to the `index.html` inside.

For example:

    + static-projects/
      |
      - index.html
      |
      + maps-project/
      |  - index.html
      |  - map.html
      |
      + graph-project/
      |  - graphs.js
      |  - graphs.css
      |  - index.html
      |  - graph.html

Will result in the following URIs, immediately when deployed:

    - /static/

    - /static/maps-project/
    - /static/maps-project/map.html

    - /static/graph-project/graphs.js
    - /static/graph-project/graphs.css
    - /static/graph-project/
    - /static/graph-project/graph.html

### Fresh Prince Lyrics
```
Now this is the story all about how
My life got flipped, turned upside down
And I'd like to take a minute, just sit right there
I'll tell you how I became the prince of a town called Bel-Air

In West Philadelphia born and raised
On the playground where I spent most of my days
Chillin' out, maxin', relaxin' all cool
And all shootin' some b-ball outside of the school
When a couple of guys, they were up to no good
Started making trouble in my neighborhood
I got in one little fight and my mom got scared
And said "You're moving with your auntie and uncle in Bel-Air"

I whistled for a cab and when it came near
The license plate said "Fresh" and it had dice in the mirror
If anything I could say that this cab was rare
But I thought nah, forget it, yo holmes to Bel-Air!

I pulled up to a house about seven or eight
And I yelled to the cabbie "Yo, holmes, smell you later!"
Looked at my kingdom I was finally there
To sit on my throne as the Prince of Bel-Air
```
