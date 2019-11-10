// Create a Browsersync instance
var bs = require( 'browser-sync' ).create();

// Listen to change events on HTML and reload
bs.watch( "src/index.html" ).on( "change", bs.reload );

// Provide a callback to capture ALL events to CSS
// files - then filter for 'change' and reload all
// css files on the page.
bs.watch( "src/js/**/*.js", function( event, file ) {
  if( event === "change" ) {
    bs.reload( "*.js" );
  }
});

// Now init the Browsersync server
bs.init({
  server: "./src"
});
