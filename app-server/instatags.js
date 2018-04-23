var https = require('https');

module.exports = {
  allTags: [],
  _readResponseBody: function (response, callback) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function (d) {
      body += d;
    });
    response.on('end', function () {
      callback(JSON.parse(body));
    });
  },
  fetchTopSearch: function (tag, callback) {
    var self = this;
    var fnSortCallback = function (data) {
      var result = data.hashtags.map(function (elem) {
        return elem.hashtag;
      }).sort(function (a, b) {
          return parseFloat(b.media_count) - parseFloat(a.media_count);
        }
      );
      callback(result);
    };

    https.get('https://www.instagram.com/web/search/topsearch/?context=blended&query=%23' + tag, function (response) {
      self._readResponseBody(response, fnSortCallback);
    });
  },
  _filterTags: function (tags, tagsToRemove) {
    var result = tags;

    for (var i in tagsToRemove) {
      result = result.filter(function (tag) {
        return tag.name != tagsToRemove[i];
      });
    }

    return result;
  },
  _printHighScore: function (tags, count) {
    for (var i in tags) {
      var tag = tags[i];
      if (i == count) {
        break;
      }
      console.log(i, tag.name, tag.media_count);
    }
  },
  _printTags: function (tags, count, prefix) {
    var out = '';
    for (var i in tags) {
      var tag = tags[i];
      if (i == count) {
        break;
      }
      out += prefix + tag.name;
    }
    console.log(out);
  }
};

