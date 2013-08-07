var spectators = []; // spectators on hero game, stays empty in solo mode

require.config({
  urlArgs: "bust=" +  (new Date()).getTime()
});

require(
        ["akihabara/gbox.js",
         "akihabara/iphopad.js",
         "akihabara/trigo.js",
         "akihabara/toys.js",
         "akihabara/help.js",
         "akihabara/tool.js",
         "akihabara/gamecycle.js"], 
         function() {
            initSoloHeroGame();
            // window.addEventListener('load', initCosmicsOrSpectators, false); // does not work with require.js
          });
//----------------------------------------------------------------------------------------------------
function initSoloHeroGame() {
      require(["client/cosmics_objects"+minExt+".js", "client/shared_objects"+minExt+".js", 
               "client/cosmics"+minExt+".js", "client/levels"+minExt+".js"], function() {
        initCosmics("the_one", null);
    });  
}
