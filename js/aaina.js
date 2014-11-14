/**
* Dribbble.js
*
* @author Tim Davies
*
* Modified by Chris Paul for Aaina Sharma. :)
*/

/**
* Fetch and parse Dribbble JSON
*
* @param dribbbleID   int/string  Dribbble User ID or username
* @param elm          string      Dom Element ID to add the shots to (optional, defaults to 'shots')
* @param limit        int         Number of shots to draw (optional, defaults to 3)
*/

// Define Global Vars
var dribbble = {
    // How many shots to display
    shotLimit : 3,
    // The div ID to draw to
    element : 'shots',
    // How many users we're loading
    usersToLoad : 0,
    // All API results
    allShots : [],
    // Complete callback
    complete : function () {},
    // Shots sort function
    order : function (a,b) {
      if (a.id > b.id)
         return -1;
      if (a.id < b.id)
        return 1;
      return 0;
    }
}

function getShotsForID (users, elm, limit, callback)
{
    /* Initialise funcation variables */
    dribbble.shotLimit = (!limit)? 3 : limit;
    dribbble.element = (!elm)? 'shots' : elm;
    dribbble.complete = callback || dribbble.complete;

    dribbble.usersToLoad = users.length;

    document.addEventListener('DOMContentLoaded', function () {

        for(var indx in users)
        {
            /* Insert JSONP Script tag*/
            var url = 'http://api.dribbble.com/players/'+users[indx]+'/shots?callback=parseShots';
            var myscript = document.createElement('script');
            myscript.src = url;
            document.body.appendChild(myscript);
        }
    });
}


/* JSONP callback handler */
function parseShots (shots)
{
    dribbble.usersToLoad--;
    dribbble.allShots.push.apply(dribbble.allShots, shots.shots);

    if(dribbble.usersToLoad === 0)
    {
        dribbble.allShots.sort(dribbble.order)

        var htmlString = ""; // "\n<ul>\n"

        for (var i = 0; i < dribbble.shotLimit; i++)
        {
            var shot = dribbble.allShots[i];
            htmlString = htmlString+"\n<div class=\"dribbble-panel text-center small-12 medium-6 columns\">"; // "\n<li class=\"dribbble_shot\">";
            htmlString = htmlString+"<a href=\""+shot.url+"\">";
            htmlString = htmlString+"<img src=\""+shot.image_url+"\" alt=\""+shot.title+"\" />";
            htmlString = htmlString+"</a>";
            htmlString = htmlString+"</div>\n"; // "</li>\n";
        }

        // htmlString = htmlString + "\n</ul>\n";
        // Add the "Show me more"
        htmlString = htmlString + "\n<div class=\"dribbble-panel text-center small-12 medium-6 columns\">" +
              "<a href=\"https://dribbble.com/aaina\"><img src=\"/aaina/images/dribbble-show-me-more.png\" /></a>\n</div>";

        document.getElementById(dribbble.element).innerHTML = htmlString;
        dribbble.complete();
    }
}

var tumblr_api_key = 'kb332nwk1ezBWgTuA5esDRL3YU6KIC8yyOaCeMdjIIS9LQVIQC';
var tumblr_doc_id;

function getLatestTumblrImage(username, id) {
    tumblr_doc_id = id;
    document.addEventListener('DOMContentLoaded', function () {
        var url = 'http://api.tumblr.com/v2/blog/definitelyobsessed.tumblr.com/posts?limit=1&api_key=' + tumblr_api_key + '&callback=parseTumblrPosts';
        var myscript = document.createElement('script');
        myscript.src = url;
        document.body.appendChild(myscript);
    });
}

function parseTumblrPosts(data) {
    var latest_post = data.response.posts[0];
    var latest_image = latest_post.photos[0];
    var htmlString = "\n<a href=\"" + latest_post.image_permalink + "\">";
    htmlString = htmlString+"\n<img src=\"" + latest_image.original_size.url + "\" alt=\"" + latest_post.caption + "\" title=\"" + latest_post.caption + "\"/></a>";
    document.getElementById(tumblr_doc_id).innerHTML = htmlString;
}