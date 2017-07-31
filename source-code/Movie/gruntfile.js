module.exports = function(grunt){
	grunt.initConfig({
	    watch: {
	      jade: {
	        files: ['views/**'],
	        options: {
	          livereload: true
	        }
	      },
	      js: {
	        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
	        //tasks: ['jshint'],
	        options: {
	          livereload: true
	        }
	      },
	      uglify: {
	        files: ['public/**/*.js'],
	        tasks: ['jshint'],
	        options: {
	          livereload: true
	        }
	      },
	      styles: {
	        files: ['public/**/*.less'],
	        tasks: ['less'],
	        options: {
	          nospawn: true
	        }
	      }
	    },
	    less: {
	      development: {
	        options: {
	          compress: true,
	          yuicompress: true,
	          optimization: 2
	        },
	        files: {
	          'public/build/index.css': 'public/less/index.less'
	        }
	      }
	    },
	    nodemon: {
	      dev: {
	        options: {
	          file: 'app.js',
	          args: [],
	          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
	          watchedExtensions: ['js'],
	          watchedFolders: ['./'],
	          debug: true,
	          delayTime: 1,
	          env: {
	            PORT: 3000
	          },
	          cwd: __dirname
	        }
	      }
	    },
	    mochaTest: {
	      options: {
	        reporter: 'spec'
	      },
	      src: ['test/**/*.js']
	    },
	    concurrent: {
	      tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
	      options: {
	        logConcurrentOutput: true
	      }
	    }
	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-mocha-test')
	grunt.loadNpmTasks('grunt-contrib-less')
	//不要因为语法错误或者警告终止整个grunt运行
	grunt.option('force',true);
	//注册一个默认任务
	grunt.registerTask('default',['concurrent']);
}