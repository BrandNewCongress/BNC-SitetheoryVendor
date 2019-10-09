// Dependencies
const { src, dest, series, parallel } = require('gulp')
// const concat = require('gulp-concat')
// const debug = require('gulp-debug')
const gulpDest = require('gulp-dest')
const terser = require('gulp-terser')
const del = require('del')
const _ = require('lodash')

// Unit Testing
// const mocha = require('mocha')
// const chai = require('chai')

// Task Specific
const standard = require('gulp-standard')
// const gulpStylelint = require('gulp-stylelint')
const minCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')

// Interpreters
const babel = require('gulp-babel')
const less = require('gulp-less')
const sass = require('gulp-sass')
const coffee = require('gulp-coffee')
// const sourcemaps = require('gulp-sourcemaps')
const ts = require('gulp-typescript')

// Helper Functions
const nullify = function (proto) {
  proto = proto || []
  const clone = _.clone(proto)
  if (_.size(proto)) {
    _.each(clone, function (value, key, list) {
      list[key] = '!' + value
    })
  }
  return clone
}

const babelSettings = {
  /* *
  presets: [
    ['env', {
      targets: {
        // The % refers to the global coverage of users from browserslist
        browsers: ['>0.25%']
      }
      // exclude: ['transform-strict-mode']
    }]
  ],
  /* */
  plugins: [
    // 'transform-runtime',
    ['transform-es2015-modules-commonjs', {
      allowTopLevelThis: true,
      strictMode: false
    }]
  ]
}

// Locations
const location = {
  mangle: {
    core: [
      '*Bundle/Resources/public/dist/*/*.js'
    ],
    min: [
      '*Bundle/Resources/public/dist/*/*.min.js'
    ]
  },
  preserve: {
    core: [
      '*Bundle/Resources/public/js/**/*.js',
      '*Bundle/Resources/public/stratus/**/*.js'
    ],
    min: [
      '*Bundle/Resources/public/js/**/*.min.js',
      '*Bundle/Resources/public/stratus/**/*.min.js'
    ],
    external: [
      '*Bundle/Resources/public/js/bower_components/**/*.js',
      '*Bundle/Resources/public/stratus/bower_components/**/*.js',
      '*Bundle/Resources/public/js/node_modules/**/*.js',
      '*Bundle/Resources/public/stratus/node_modules/**/*.js'
    ],
    nonstandard: [
      '*Bundle/Resources/public/js/examples/*.js',
      '*Bundle/Resources/public/stratus/**/deprecated-reference/*.js',
      'CoreBundle/Resources/public/js/components/formSignup-simple.js'
    ]
  },
  less: {
    core: [
      '*Bundle/Resources/public/css/**/*.less',
      '*Bundle/Resources/public/stratus/**/*.less',
      '*Bundle/src/*/*/Resources/public/css/**/*.less'
    ],
    external: [
      '*Bundle/Resources/public/js/bower_components/**/*.less',
      '*Bundle/Resources/public/stratus/bower_components/**/*.less',
      '*Bundle/Resources/public/js/node_modules/**/*.less',
      '*Bundle/Resources/public/stratus/node_modules/**/*.less'
    ],
    compile: []
  },
  sass: {
    core: [
      '*Bundle/Resources/public/css/**/*.scss',
      '*Bundle/Resources/public/stratus/**/*.scss',
      '*Bundle/src/*/*/Resources/public/css/**/*.scss'
    ],
    external: [
      '*Bundle/Resources/public/js/bower_components/**/*.scss',
      '*Bundle/Resources/public/stratus/bower_components/**/*.scss',
      '*Bundle/Resources/public/js/node_modules/**/*.scss',
      '*Bundle/Resources/public/stratus/node_modules/**/*.scss'
    ],
    compile: []
  },
  css: {
    core: [
      '*Bundle/Resources/public/css/**/*.css',
      '*Bundle/Resources/public/stratus/**/*.css',
      '*Bundle/src/*/*/Resources/public/css/**/*.css'
    ],
    min: [
      '*Bundle/Resources/public/css/**/*.min.css',
      '*Bundle/Resources/public/stratus/**/*.min.css',
      '*Bundle/src/*/*/Resources/public/css/**/*.min.css'
    ],
    external: [
      '*Bundle/Resources/public/js/bower_components/**/*.css',
      '*Bundle/Resources/public/stratus/bower_components/**/*.css',
      '*Bundle/Resources/public/js/node_modules/**/*.css',
      '*Bundle/Resources/public/stratus/node_modules/**/*.css'
    ]
  },
  coffee: {
    core: [
      '*Bundle/Resources/public/js/**/*.coffee',
      '*Bundle/Resources/public/stratus/**/*.coffee',
      '*Bundle/src/*/*/Resources/public/js/**/*.coffee'
    ],
    external: [
      '*Bundle/Resources/public/js/bower_components/**/*.coffee',
      '*Bundle/Resources/public/stratus/bower_components/**/*.coffee',
      '*Bundle/Resources/public/js/node_modules/**/*.coffee',
      '*Bundle/Resources/public/stratus/node_modules/**/*.coffee'
    ],
    compile: []
  },
  typescript: {
    core: [
      '*Bundle/Resources/public/js/**/*.ts',
      '*Bundle/Resources/public/stratus/**/*.ts',
      '*Bundle/src/*/*/Resources/public/js/**/*.ts'
    ],
    external: [
      '*Bundle/Resources/public/js/bower_components/**/*.ts',
      '*Bundle/Resources/public/stratus/bower_components/**/*.ts',
      '*Bundle/Resources/public/js/node_modules/**/*.ts',
      '*Bundle/Resources/public/stratus/node_modules/**/*.ts'
    ],
    compile: []
  },
  template: {
    core: [
      '*Bundle/Resources/public/js/**/*.html',
      '*Bundle/Resources/public/stratus/**/*.html'
    ],
    min: [
      '*Bundle/Resources/public/js/**/*.min.html',
      '*Bundle/Resources/public/stratus/**/*.min.html'
    ],
    external: [
      '*Bundle/Resources/public/js/bower_components/**/*.html',
      '*Bundle/Resources/public/stratus/bower_components/**/*.html',
      '*Bundle/Resources/public/js/node_modules/**/*.html',
      '*Bundle/Resources/public/stratus/node_modules/**/*.html'
    ],
    nonstandard: [
      '*Bundle/Resources/public/js/deprecated/**/*.html',
      '*Bundle/Resources/public/stratus/deprecated/**/*.html'
    ]
  }
}

// Code Linters
function lintJS () {
  return src(_.union(location.preserve.core, nullify(location.preserve.min), nullify(location.preserve.external), nullify(location.preserve.nonstandard)))
    /* *
    .pipe(debug({
      title: 'Standardize:'
    }))
    /* */
    .pipe(standard({
      fix: true
    }))
    .pipe(standard.reporter('default', {
      breakOnError: true,
      breakOnWarning: true,
      showRuleNames: true
    }))
}

// Mangle Functions
function cleanMangle () {
  if (!location.mangle.min.length) {
    return Promise.resolve('No files selected.')
  }
  return del(location.mangle.min)
}
function compressMangle () {
  return src(_.union(location.mangle.core, nullify(location.mangle.min)), {
    base: '.'
  })
    /* *
    .pipe(debug({
      title: 'Compress Mangle:'
    }))
    /* */
    .pipe(babel(babelSettings))
    .pipe(terser({
      // preserveComments: 'license',
      mangle: true
    }))
    .pipe(gulpDest('.', {
      ext: '.min.js'
    }))
    .pipe(dest('.'))
}

// Preserve Functions
function cleanPreserve () {
  if (!location.preserve.min.length) {
    return Promise.resolve('No files selected.')
  }
  return del(_.union(location.preserve.min, nullify(location.preserve.external)))
}
function compressPreserve () {
  return src(_.union(location.preserve.core, nullify(location.preserve.min), nullify(location.preserve.external)), {
    base: '.'
  })
    /* *
    .pipe(debug({
      title: 'Compress Preserve:'
    }))
    /* */
    .pipe(babel(babelSettings))
    .pipe(terser({
      // preserveComments: 'license',
      mangle: false
    }))
    .pipe(gulpDest('.', {
      ext: '.min.js'
    }))
    .pipe(dest('.'))
}

// LESS Functions
const cleanLESS = function () {
  if (!location.less.compile.length) {
    return Promise.resolve('No files selected.')
  }
  return del(_.union(location.less.compile, nullify(location.less.external)))
}
function compileLESS () {
  return src(_.union(location.less.core, nullify(location.less.compile), nullify(location.less.external)), { base: '.' })
    // .pipe(debug({ title: 'Compile LESS:' }))
    .pipe(less({
      globalVars: {
        asset: "'/assets/1/0'"
      }
    }))
    .pipe(gulpDest('.', { ext: '.css' }))
    .pipe(dest('.'))
}

// SASS Functions
function cleanSASS () {
  if (!location.sass.compile.length) {
    return Promise.resolve('No files selected.')
  }
  return del(_.union(location.sass.compile, nullify(location.sass.external)))
}
function compileSASS () {
  return src(_.union(location.sass.core, nullify(location.sass.compile), nullify(location.sass.external)), { base: '.' })
    // .pipe(debug({ title: 'Compile SASS:' }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpDest('.', { ext: '.css' }))
    .pipe(dest('.'))
}

// CSS Functions
function cleanCSS () {
  if (!location.css.min.length) {
    return Promise.resolve('No files selected.')
  }
  return del(_.union(location.css.min, nullify(location.css.external)))
}
function compressCSS () {
  return src(_.union(location.css.core, nullify(location.css.min), nullify(location.css.external)), { base: '.' })
    // .pipe(debug({ title: 'Compress CSS:' }))
    .pipe(minCSS({
      compatibility: '*'
    }))
    .pipe(gulpDest('.', { ext: '.min.css' }))
    .pipe(dest('.'))
}

// CoffeeScript Functions
function cleanCoffee () {
  if (!location.coffee.compile.length) {
    return Promise.resolve('No files selected.')
  }
  return del(_.union(location.coffee.compile, nullify(location.coffee.external)))
}
function compileCoffee () {
  return src(_.union(location.coffee.core, nullify(location.coffee.compile), nullify(location.coffee.external)), { base: '.' })
    // .pipe(debug({ title: 'Compile Coffee:' }))
    .pipe(coffee({}))
    .pipe(gulpDest('.', { ext: '.js' }))
    .pipe(dest('.'))
}

// TypeScript Functions
function cleanTypeScript () {
  if (!location.typescript.compile.length) {
    return Promise.resolve('No files selected.')
  }
  return del(_.union(location.typescript.compile, nullify(location.typescript.external)))
}
function compileTypeScript () {
  return src(_.union(location.typescript.core, nullify(location.typescript.compile), nullify(location.typescript.external)), { base: '.' })
    // .pipe(debug({ title: 'Compile TypeScript:' }))
    .pipe(ts({
      noImplicitAny: true
    }))
    .pipe(gulpDest('.', { ext: '.js' }))
    .pipe(dest('.'))
}

// Template Functions
const cleanTemplate = function () {
  if (!location.template.min.length) {
    return Promise.resolve('No files selected.')
  }
  return del(_.union(location.template.min, nullify(location.template.external), nullify(location.template.nonstandard)))
}
function compressTemplate () {
  return src(_.union(location.template.core, nullify(location.template.min), nullify(location.template.external), nullify(location.template.nonstandard)), {
    base: '.'
  })
    /* *
    .pipe(debug({
      title: 'Compress Template:'
    }))
    /* */
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true
    }))
    .pipe(gulpDest('.', {
      ext: '.min.html'
    }))
    .pipe(dest('.'))
}

// Modules Exports
exports.compile = parallel(
  series(cleanLESS, compileLESS),
  series(cleanSASS, compileSASS),
  series(cleanCoffee, compileCoffee),
  series(cleanTypeScript, compileTypeScript)
)
exports.compress = parallel(
  series(cleanMangle, compressMangle),
  series(cleanPreserve, compressPreserve),
  series(cleanCSS, compressCSS),
  series(cleanTemplate, compressTemplate)
)
exports.clean = parallel(
  cleanMangle,
  cleanPreserve,
  cleanLESS,
  cleanSASS,
  cleanCSS,
  cleanCoffee,
  cleanTypeScript,
  cleanTemplate
)
exports.lint = parallel(
  lintJS
)
