'use strict';

angular
  .module('muveApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
  ]).run(['$rootScope', 'Auth', function($rootScope, Auth) {

    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);