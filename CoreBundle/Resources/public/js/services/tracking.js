//     Stratus.Services.Tracking.js 1.0

// BNC Tracking Service
// --------------------------

/* global define, ga */

// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['stratus', 'underscore'], factory)
  } else {
    factory(root.Stratus, root._)
  }
}(this, function (Stratus, _) {
  Stratus.Services.Tracking = ['$provide', function ($provide) {
    $provide.factory('Tracking', ['$document', '$window', function ($document, $window) {
      return function () {
        this.parseURL = function (url) {
          var a = document.createElement('a')
          a.href = url
          return a.hostname
        }
        this.getParameterByName = function (name, url) {
          if (!url) url = window.location.href
          name = name.replace(/[[\]]/g, '\\$&')
          var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
          var results = regex.exec(url)
          if (!results) return null
          if (!results[2]) return ''
          return decodeURIComponent(results[2].replace(/\+/g, ' '))
        }
        this.getUTMCode = function (name) {
          const value = this.getParameterByName(name)
          if (!value && name === 'utmSource') {
            return this.parseURL(document.referrer)
          }
          return value
        }
        this.getRefcode = function () {
          var recruiterCode = window.location.href.match(/(?:\?|&)ref=([a-zA-Z0-9]+)/)
          if (recruiterCode) {
            return recruiterCode[1]
          }
          var utmCampaign = this.getUTMCode('utmCampaign')
          var utmSource = this.getUTMCode('utmSource')
          var utmMedium = this.getUTMCode('utmMedium')
          return (utmCampaign ? (utmCampaign + '/') : '') + (utmSource || '') + (utmMedium ? ('/' + utmMedium) : '')
        }
        this.setRefcode = function (options) {
          options = !options ? {} : options
          options.url = !options.url ? 'http' : options.url
          var links = document.querySelectorAll('[href^="' + options.url + '"]')
          if (links.length > 0) {
            var refCode = this.getRefcode()
            for (var index = 0; index < links.length; index++) {
              var link = links[index]
              link.href = Stratus.Internals.SetUrlParams({ refcode: refCode }, link.href)
            }
          }
        }
        this.send = function (category, action) {
          if (typeof ga !== 'function') return false
          ga('send', 'event', category, action)
          return true
        }
      }
    }])
  }]
}))
