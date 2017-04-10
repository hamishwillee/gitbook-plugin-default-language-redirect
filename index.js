/**
 * Copyright 2017 Hamish Willee
 *
 * Licensed under BSD 3-Clause License.
 */

var current_lang_pages=[]; //Array of all pages in current language.

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
    "page": function(page) {
      
      /* Get array of all the pages in the current language and save them */
      
      //Get redirect language from config (or 'en' if not specified)
      var redirectConf = this.config.get("pluginsConfig.language-redirect");
      var redirect_language = redirectConf.language || "en";
      
      // Infer current language using current output root. 
      // Will either be "_book" (no language) or a language code
      var current_language=this.output.root().split('\\').pop();
      if (current_language=='_book') {
         current_language='';
         }
      
      // For current language save the redirect file name
      if (redirect_language==current_language) {
          //console.log("CURRENT Page: ", page.path )
          //strip off the .mds and replace with .html (output path)
          page_path=page.path;
          page_path=page_path.split('.')
          page_path.pop();
          page_path=page_path.join()+'.html';
          current_lang_pages.push(page_path)
      }

      return page;  
      },
      
      
    "finish": function() {   
        /* Iterate through the the array of pages. Create redirects for each page in the array, 
        pointing to equivalent file in the "language path" */
        
        // Get redirect language from config
        var redirectConf = this.config.get("pluginsConfig.language-redirect");
        var redirect_language = redirectConf.language || "en";
        //Get current language for iteration of finish() function.
        var current_language=this.output.root().split('\\').pop();
        if (current_language=='_book') {
            current_language='';
        }
        
        //Construct redirect file for each page.
        var g = this;
        if (''==current_language) {
            //Current language is '' which means writeFile() create copy pages into root
            //Otherwise the file gets written relative to the current output langauge path. 
            current_lang_pages.forEach(function(page) {
                var redirect_page = '/' + redirect_language + '/' + page;
                console.log("FROM Page: ", page.path )
                console.log("TO Page: ", redirect_page )
                g.output.writeFile(page, content(redirect_page));
            });
        }
           
    }  //finish
      
   }  //hooks
}  //modules
