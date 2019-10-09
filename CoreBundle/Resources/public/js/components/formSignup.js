// BNC Form Signup Component
// -----------------------
/*

<script src="https://brandnewcongress.org/assets/1/0/bundles/bnccore/js/boot/config-external.js"></script>
<script src="https://brandnewcongress.org/assets/1/0/bundles/sitetheorystratus/stratus/dist/boot.min.js"></script>
<stratus-form-signup
     url="https://api.brandnewcongress.org"
     controller="/people"
     redirect-url="https://secure.actblue.com/contribute/page/bncsignup"
     response-success="Thanks for signing up! We'll be in touch soon."
     options=""
 ></stratus-form-signup>
 */

/* global define */

// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
  // This will define the dependencies that will load in require.js
  if (typeof define === 'function' && define.amd) {
    define([
      'stratus',
      'lodash',
      'angular',

      // Modules
      'angular-material',

      // Services
      'stratus.services.registry',
      'stratus.services.model',
      'stratus.services.collection',

      // Controllers
      'stratus.controllers.api'
    ], factory)
  } else {
    // If there is no define then it starts the function instantly, but it wouldn't have any requirements, only root (window) available objects
    factory(root.Stratus, root._, root.angular)
  }
  // this=root (window), function = factory
  // the properties passed to the function, are the items (in order) defined in the define() or factory()
  // These properties are now available inside the factory
// }(this, function (Stratus, Template) {
}(this, function (Stratus, _, angular) {
  // This component creates a form to submit nominations
  Stratus.Components.FormSignup = {
    bindings: {
      ngModel: '=',
      elementId: '@',
      // Custom Properties
      options: '@',
      url: '@',
      controller: '@',
      responseSuccess: '@',
      redirectUrl: '@',
      buttonText: '@'
    },
    controller: function ($scope, $element, $http, $attrs) {
      var uid = _.uniqueId('formSignup_')
      Stratus.Instances[uid] = $scope
      $scope.model = $scope.$parent.model

      // OPTIONS: These extend the options from Stratus.Controller.Api. If we need more control, we can add more
      // bindings via data attributes and add them here. These options are passed in via the template, which are
      // then merged with the API controller's default options.

      $scope.options = {
        id: $element.id ? $element.id + 'Component' : uid,
        url: $attrs.url || 'https://api.brandnewcongress.org',
        controller: $attrs.controller || '/people',
        response: {
          success: $attrs.responseSuccess || 'Thank you for signing up! We will be in touch.'
        },
        redirect: {
          url: $attrs.redirectUrl || false
        },
        buttonText: 'Sign Me Up'
      }
    },
    // templateUrl: Stratus.BaseUrl + requirejs.s.contexts._.config.paths['templates-form-signup']

    // Temporarily Hard Coding this to internal template to avoid CORS issue
    template: '<form class="formSignup positionAnchor"id="{{ $parent.options.id }}"name="Signup"ng-class="status"ng-cloak ng-cloak-reveal ng-controller="Api"ng-sanitize="true"ng-submit="send(\'Signup\') && tracking.send(\'SignupButton\', \'click\')"options="{{ $parent.options }}"><input name="utmSource"type="hidden"ng-value="model.data.utmSource"> <input name="utmMedium"type="hidden"ng-value="model.data.utmMedium"> <input name="utmCampaign"type="hidden"ng-value="model.data.utmCampaign"><md-progress-circular md-mode="indeterminate"ng-show="status === \'sending\'"></md-progress-circular><p class="message"ng-bind-html="response"ng-show="response.length"><div class="clearfix inputCollection"ng-show="status !== \'success\'"><div class="inputBlock"><md-input-container><label>Email</label><input name="email"type="email"md-no-asterisk ng-model="model.data.email"ng-pattern="options.pattern.email"required><div ng-messages="Signup.email.$error"role="alert"><div ng-message-exp="[\'required\', \'pattern\']">Please enter a valid email.</div></div></md-input-container></div><div class="inputBlock"><md-input-container><label>Zip</label><input name="zip"md-no-asterisk ng-model="model.data.zip"ng-pattern="options.pattern.zip"required><div ng-messages="Signup.zip.$error"role="alert"><div ng-message-exp="[\'required\', \'pattern\']">Please enter a valid zip code.</div></div></md-input-container></div><div class="inputBlock"><button class="btn formSubmit"ng-disabled="Signup.$invalid"type="submit">{{ options.buttonText }}</button></div></div></form>'

  }
}))
