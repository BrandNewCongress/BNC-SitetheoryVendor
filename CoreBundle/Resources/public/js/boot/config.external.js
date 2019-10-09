/**
 * Custom BNC Vendor Config
 * Location: @BNCCoreBundle/Resources/public/js/boot/config.js
 * Embed this script on any page in order to load Stratus. Based on the config, Stratus will scan for supported
 * components and load them on the page of any website. Load this custom require boot config first if you define custom
 * paths to require.
 *      <script src="https://brandnewcongress.org/assets/1/0/bundles/bnccore/js/boot/config.external.js"></script>
 *      <script src="https://brandnewcongress.org/assets/1/0/bundles/sitetheorystratus/stratus/dist/boot.min.js"></script>
 *      <stratus-form-signup></stratus-form-signup>
 * @type {string}
 */

/* global boot */

var vendorBundle = 'bnccore/'
var config = function (boot) {
  // Deployment Customization for External Sites
  boot.host = '//brandnewcongress.org'
  boot.cdn = '//cdn.sitetheory.io/'
  boot.relative = 'assets/1/0/bundles/'
  boot.bundle = 'sitetheorystratus/'
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
