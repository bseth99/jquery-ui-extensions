module.exports = function( grunt ) {

var
   // files
   coreFiles = [
      "jquery.ui.spinner.js"
   ],

   uiFiles = coreFiles.map(function( file ) {
      return "ui/" + file;
   }).concat( expandFiles( "ui/*.js" ).filter(function( file ) {
      return coreFiles.indexOf( file.substring(3) ) === -1;
   })),

   cssFiles = [
      "spinner",
      "slidespinner",
      "labeledslider",
      "combobox",
      "waitbutton",
      "timepicker"
   ].map(function( component ) {
      return "themes/base/jquery.ui." + component + ".css";
   }),

   // minified files
   minify = {
      options: {
         preserveComments: false
      },
      main: {
         options: {
            banner: createBanner( uiFiles )
         },
         files: {
            "dist/ext-jquery-ui.min.js": "dist/ext-jquery-ui.js"
         }
      }
   },

   minifyCSS = {
      options: {
         keepSpecialComments: 0
      },
      main: {
         options: {
            keepSpecialComments: "*"
         },
         src: "dist/ext-jquery-ui.css",
         dest: "dist/ext-jquery-ui.min.css"
      }
   };

function mapMinFile( file ) {
   return "dist/" + file.replace( /\.js$/, ".min.js" ).replace( /ui\//, "minified/" );
}

function expandFiles( files ) {
   return grunt.util._.pluck( grunt.file.expandMapping( files ), "src" ).map(function( values ) {
      return values[ 0 ];
   });
}

uiFiles.forEach(function( file ) {
   minify[ file ] = {
      options: {
         banner: createBanner()
      },
      files: {}
   };
   minify[ file ].files[ mapMinFile( file ) ] = file;
});

cssFiles.forEach(function( file ) {
   minifyCSS[ file ] = {
      options: {
         banner: createBanner()
      },
      src: file,
      dest: "dist/" + file.replace( /\.css$/, ".min.css" ).replace( /themes\/base\//, "themes/base/minified/" )
   };
});

function stripDirectory( file ) {
   return file.replace( /.+\/(.+?)>?$/, "$1" );
}

function createBanner( files ) {
   // strip folders
   var fileNames = files && files.map( stripDirectory );
   return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
      "<%= grunt.template.today('isoDate') %>\n" +
      "<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
      (files ? "* Includes: " + fileNames.join(", ") + "\n" : "")+
      "* Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
      " Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n";
}


grunt.loadNpmTasks( "grunt-contrib-uglify" );
grunt.loadNpmTasks( "grunt-contrib-concat" );
grunt.loadNpmTasks( "grunt-contrib-cssmin" );
grunt.loadNpmTasks( "grunt-text-replace" );
grunt.loadNpmTasks( "grunt-contrib-copy" );

grunt.initConfig({

   pkg: grunt.file.readJSON("package.json"),
   files: {
      dist: "<%= pkg.name %>-<%= pkg.version %>"
   },
   concat: {
      ui: {
         options: {
            banner: createBanner( uiFiles ),
            stripBanners: {
               block: true
            }
         },
         src: uiFiles,
         dest: "dist/ext-jquery-ui.js"
      },
      css: {
         options: {
            banner: createBanner( cssFiles ),
            stripBanners: {
               block: true
            }
         },
         src: cssFiles,
         dest: "dist/ext-jquery-ui.css"
      }
   },
   uglify: minify,
   cssmin: minifyCSS,
   copy: {
      images: {
         files: [
            {expand: true, flatten: true, src: ['themes/base/images/*'], dest: 'dist/images/', filter: 'isFile'}
         ]
      },
      full: {
         files: [
            {expand: true, flatten: true, src: ['ui/*'], dest: 'dist/full/', filter: 'isFile'}
         ]
      }
   },
   replace: {
      version: {
         src: ['dist/**/*.js'],
         overwrite: true,
         replacements: [{
            from: /@VERSION/g,
            to: "<%= pkg.version %>"
         }]
      }
   }
});

grunt.registerTask( "default", [ "concat", "uglify", "cssmin", "copy", "replace" ] );

};
