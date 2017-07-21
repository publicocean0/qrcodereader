module.exports = function(grunt) {
var exec = require('exec');

var cwd=process.cwd()+"/"; 
grunt.log.writeln('Current dir is '+cwd)

grunt.initConfig({


bindep: {
default_options: {
localDependencies:[],
packageHandler:function(n,mains,deps){
},
templates:[{target:cwd,sources:['test.tpl'],extension:'html'}],
development:grunt.option( "dev" )!==undefined,
shortLinks:true,

attachments:{
js: {replacement:{link:'<script src="{{file}}"></script>',inline:'<script>{{source}}</script>'},target:cwd},
css:{replacement:{link:'<link rel="stylesheet" href="{{file}}"  media="screen" />',inline:'<style>{{source}}</style>'},target:cwd}
},
resources:{
}



}
}
}
);



	grunt.loadNpmTasks('bindep');
	// Default task(s).
	grunt.registerTask('default', ['bindep' ]);

};


