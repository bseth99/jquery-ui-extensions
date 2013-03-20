module.exports = function( grunt ) {

var
   // files
   coreFiles = [
      "jquery.ui.spinner.js"
   ],

   uiFiles = coreFiles.map(function( file ) {
      return "ui/" + file;
   }).concat( grunt.file.expandFiles( "ui/*.js" ).filter(function( file ) {
      return coreFiles.indexOf( file.substring(3) ) === -1;
   })),

   cssFiles = [
      "spinner",
      "slidespinner",
      "labeledslider",
      "combobox"
   ].map(function( component ) {
      return "themes/base/jquery.ui." + component + ".css";
   }),

   // minified files
   minify = {
      "bseth99-jquery-ui.min.js": [ "<banner:meta.bannerAll>", "bseth99-jquery-ui.js" ]
   };

function mapMinFile( file ) {
   return file.replace( /\.js$/, ".min.js" ).replace( /ui\//, "minified/" );
}

grunt.registerHelper( "strip_all_banners", function( filepath ) {
   return grunt.file.read( filepath ).replace( /^\s*\/\*[\s\S]*?\*\/\s*/g, "" );
});

function stripBanner( files ) {
   return files.map(function( file ) {
      return "<strip_all_banners:" + file + ">";
   });
}

function stripDirectory( file ) {
   return file.replace( /.+\/(.+?)>?$/, "$1" );
}

function createBanner( files ) {
   // strip folders
   var fileNames = files && files.map( stripDirectory );
   return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
      "<%= grunt.template.today('isoDate') %>\n" +
      "<%= pkg.homepage ? '* ' + pkg.homepage + '\n' : '' %>" +
      "* Includes: " + (files ? fileNames.join(", ") : "<%= stripDirectory(grunt.task.current.file.src[1]) %>") + "\n" +
      "* Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
      " Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */";
}

grunt.initConfig({

   pkg: '<json:package.json>',

   meta: {
      bannerAll: createBanner( uiFiles ),
      bannerCSS: createBanner( cssFiles )
   },

   concat: {
      ui: {
         src: [ "<banner:meta.bannerAll>", stripBanner( uiFiles ) ],
         dest: "bseth99-jquery-ui.js"
      },

      css: {
         src: [ "<banner:meta.bannerCSS>", stripBanner( cssFiles ) ],
         dest: "bseth99-jquery-ui.css"
      }
   },

   min: minify

});

grunt.registerTask( "default", "concat min" );

};
