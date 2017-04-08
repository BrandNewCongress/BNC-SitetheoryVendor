// BNC Form Signup Component
// -----------------------
/*

<script src="https://brandnewcongress.org/assets/1/0/bundles/bnccore/js/boot/config.js">
<script src="https://brandnewcongress.org/assets/1/0/bundles/sitetheorystratus/stratus/dist/boot.min.js">
<stratus-form-signup
     url="https://api.brandnewcongress.org"
     controller="/people"
     redirect-url="https://secure.actblue.com/contribute/page/bncsignup"
     response-success="Thanks for signing up! We'll be in touch soon."
     options=""
 ></stratus-form-signup>
 */


// Define AMD, Require.js, or Contextual Scope
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        var requirements = ['stratus', 'angular', 'stratus.controllers.api'];
        if (typeof document.cookie === 'string' && document.cookie.indexOf('env=') !== -1) {
            requirements.splice(1, 0, 'text!templates-form-signup');
        }
        define(requirements, factory);
    } else {
        factory(root.Stratus);
    }
}(this, function (Stratus, Template) {

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
            var uid = _.uniqueId('formSignup_');
            Stratus.Instances[uid] = $scope;
            $scope.model = $scope.$parent.model;

            // OPTIONS: These extend the options from Stratus.Controller.Api. If we need more control, we can add more
            // bindings via data attributes and add them here. These options are passed in via the template, which are
            // then merged with the API controller's default options.

            $scope.options = {
                id: $element.id ? $element.id+'Component' : uid,
                url: $attrs.url || 'https://api.brandnewcongress.org',
                controller: $attrs.controller || '/people',
                response: {
                    success: $attrs.responseSuccess || 'Thank you for signing up! We will be in touch.'
                },
                redirect: {
                    url: $attrs.redirectUrl || false
                },
                buttonText: 'Sign Me Up'
            };

        },
        //templateUrl: Stratus.BaseUrl + requirejs.s.contexts._.config.paths['templates-form-signup']

        template: (typeof Template === 'string') ? Template : '<form id="{{ $parent.options.id }}" name="Signup" ng-controller="Api" ng-submit="send(\'Signup\') && tracking.send(\'SignupButton\', \'click\')" ng-sanitize="true" options="{{ $parent.options }}" ng-class="status" class="positionAnchor" ng-cloak ng-cloak-reveal><input type="hidden" name="utmSource" ng-value="model.data.utmSource"> <input type="hidden" name="utmMedium" ng-value="model.data.utmMedium"> <input type="hidden" name="utmCampaign" ng-value="model.data.utmCampaign"><md-progress-circular md-mode="indeterminate" ng-show="status === \'sending\'"></md-progress-circular><p class="message" ng-show="response.length" ng-bind-html="response"></p><ul class="listInline divCenter fontSecondary" ng-show="status !== \'success\'"><li><md-input-container><label>Email</label><input name="email" type="email" ng-pattern="options.pattern.email" ng-model="model.data.email" required md-no-asterisk><div ng-messages="Signup.email.$error" role="alert"><div ng-message-exp="[\'required\', \'pattern\']">Please enter a valid email.</div></div></md-input-container></li><li><md-input-container><label>Zip</label><input name="zip" ng-pattern="options.pattern.zip" ng-model="model.data.zip" required md-no-asterisk><div ng-messages="Signup.zip.$error" role="alert"><div ng-message-exp="[\'required\', \'pattern\']">Please enter a valid zip code.</div></div></md-input-container></li><li><button type="submit" class="btn formSubmit" ng-disabled="Signup.$invalid">{{ options.buttonText }}</button></li></ul></form>'

    };
}));
