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
    'uiGmapgoogle-maps',
    'timer',
    'angularMoment',
  ])
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDHdYXdnldo9gbiBCr0BwsUYMPpim6sm80',
        libraries: 'weather,geometry,visualization'
    });
  })
  .run(['$rootScope', 'Auth', function($rootScope, Auth) {

    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);