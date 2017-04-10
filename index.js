/**
 * Copyright 2017 Hamish Willee
 *
 * Licensed under BSD 3-Clause License.
 */

var url = require("url");
var fs = require("fs");

var content = function(path) {
  var s = "<!DOCTYPE HTML><html><head><meta charset='UTF-8'><title>Redirecting from root</title>" +
        "<link rel='canonical' href='{}'><meta http-equiv=refresh content='0; url={:?}'></head>" +
        "<body><h1>Redirecting...</h1>" +
        "<p><a href='{}'>Click here if you are not redirected</a></p>" +
        "<script>window.location.href='{}';</script>" +
        "</body></html>";
  return s.replace(/\{\}/gm, path).replace(/\{\:\?\}/gm, encodeURI(path));
};


module.exports = {
  hooks: {
    "page": function() {
        
      var redirectConf = this.config.get("pluginsConfig.language-redirect");
      var basepath = redirectConf.language || "en";
      
      var lang=g.output.root().split('\\').pop();
      if (lang=='_book') {
         lang='';
         }
      console.log("LANG", lang );
      
      /*
      var g = this;
      
      var resolved = url.resolve(basepath, item.to);
        
        if (lang=='') {
            g.output.writeFile(item.from, content(resolved));
        }
        
        */
        
      });
    }
  }
};
