/*
    Custom BNC Vendor Config

    Location: @BNCCoreBundle/Resources/public/js/boot/config.js
    This is the standard shared config for local Sitetheory based sites. There is a separate external config for use in
    external sites.
*/

/* global boot */

var vendorBundle = 'bnccore/'
var config = function (boot) {
  return {

    /* Vendor Custom Controllers */
    'stratus.services.tracking': vendorBundle + 'js/services/tracking' + boot.suffix,

    /* Vendor Custom Controllers */
    'stratus.controllers.api': vendorBundle + 'js/controllers/api' + boot.suffix,

    /* Vendor Custom Components */
    'stratus.components.formSignup': vendorBundle + 'js/components/formSignup' + boot.suffix,
    'templates-form-signup': vendorBundle + 'js/components/formSignup.html'
  }
}
// Merge Config
if (typeof boot === 'object' && boot && typeof boot.config === 'function') {
  boot.config(config(boot))
}
