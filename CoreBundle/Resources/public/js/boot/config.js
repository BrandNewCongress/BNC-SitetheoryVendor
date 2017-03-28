// Custom Config

var vendorBundle = 'bnccore/';

// Begin Config Object
boot.config({

    /* Vendor Custom Controllers */
    'stratus.services.tracking': vendorBundle + 'js/services/tracking' + boot.suffix,

    /* Vendor Custom Controllers */
    'stratus.controllers.api': vendorBundle + 'js/controllers/api' + boot.suffix,

    /* Vendor Custom Components */
    'stratus.components.formNominate': vendorBundle + 'js/components/formNominate' + boot.suffix,
    'templates-form-nominate': vendorBundle + 'js/components/formNominate.html'

});
