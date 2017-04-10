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
     
    "page:before": function(page) {
        
        /* Get array of all the pages in the current language and save them */
        
        var logtext = '';
         
        //Get redirect language from config (or 'en' if not specified)
        var redirectConf = this.config.get("pluginsConfig.language-redirect");
        var redirect_language = redirectConf.language || "en";
      
        logtext += "\nredirect_language: " + redirect_language + '\n';
      
        // Infer current language using current output root. 
        // Will either be "_book" (no language) or a language code
        var current_language=this.output.root().split('\\').pop().split('/').pop();
        if (current_language=='_book') {
            current_language='';
            }
         
        logtext += "\ncurrent_language: " + current_language + '\n';
      
      // For current language save the redirect file name
        if (redirect_language==current_language) {
            logtext += "\npage_path: " + page.path + '\n';
            current_lang_pages.push(page.path)
        }
        
        //page.content = "# DEBUG \n" + logtext + '\n' + page.content;
        //console.log("DEBUG: " + logtext)
        return page;
    },
      
      
    "finish": function() {   
        /* Iterate through the the array of pages. Create redirects for each page in the array, 
        pointing to equivalent file in the "language path" */
        
        // Get redirect language from config
        var redirectConf = this.config.get("pluginsConfig.language-redirect");
        var redirect_language = redirectConf.language || "en";
        var redirect_base_url = redirectConf.baseurl || "/";
        //Get current language for iteration of finish() function.
        var current_language=this.output.root().split('\\').pop().split('/').pop();
        if (current_language=='_book') {
            current_language='';
            }
            
        
        
        //Construct redirect file for each page.
        var g = this;
        console.log("CURRENT_LANG: ", current_language)
        console.log("current_lang_pages: ", current_lang_pages)
        
        
        if (''==current_language) {
            //Current language is '' which means writeFile() create copy pages into root
            //Otherwise the file gets written relative to the current output language path. 
            current_lang_pages.forEach(function(page) {
                
                //strip off the .mds and replace with .html for output path
                var page_path=page;
                page_path=page_path.split('.')
                page_path.pop();
                page_path=page_path.join()+'.html';
                //replace page path name to index.html if it is README.html (makes folder links work!)
                page_path=page_path.replace('README.html','index.html')
                //console.log("FROM Page: ", page_path)
                
                var redirect_page_url = g.output.toURL(page);
                var redirect_page_url = redirect_base_url + redirect_language + '/' + redirect_page_url;
                //var redirect_page_url = '/' + redirect_language + '/' + page;
                //console.log("TO Page: ", redirect_page_url )
                g.output.writeFile(page_path, content(redirect_page_url));
            });
        }
        
        
           
    }  //finish
      
   }  //hooks
}  //modules
