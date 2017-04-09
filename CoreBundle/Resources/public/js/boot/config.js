// Custom Config

var vendorBundle = 'bnccore/';

// Begin Config Object
var config = function(boot) {

    // TODO: update to live site
    boot.host="//bnc.sitetheory.net";
    boot.cdn="//cdn.sitetheory.io/";
    boot.relative="assets/1/0/bundles/";
    boot.bundle="sitetheorystratus/";
    return {
        /* Vendor Custom Controllers */
        'stratus.services.tracking': vendorBundle + 'js/services/tracking' + boot.suffix,

        /* Vendor Custom Controllers */
        'stratus.controllers.api': vendorBundle + 'js/controllers/api' + boot.suffix,

        /* Vendor Custom Components */
        'stratus.components.formSignup': vendorBundle + 'js/components/formSignup' + boot.suffix,
        'templates-form-signup': vendorBundle + 'js/components/formSignup.html'
    };
};
if(typeof boot === "object" && boot && typeof boot.config === "function") {
    boot.config(config(boot));
}