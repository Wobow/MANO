'use strict';

var securedRoutes = [];

angular.module('muveApp')

  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.whenAuthenticated = function(path, route) {
      securedRoutes.push(path); 
      route.resolve = route.resolve || {};
      route.resolve.user = ['Auth', function (Auth) {
        return Auth.$requireAuth();
      }];
      route.resolve.currentUser = ['Auth', 'user', '$q', '$state', function (Auth, user, $q, $state) {
        var deferred = $q.defer();
        Auth.$waitForAuth().then(function(user) {
          deferred.resolve(user);
        }, function(err) {
          $state.go('login');
          deferred.reject(err);
        });   
        
        return deferred.promise;
      }];
      $stateProvider.state(path, route);
    };
  }])


  .config(['$stateProvider', '$urlRouterProvider', 'manoStates', function($stateProvider, $urlRouterProvider, manoStates) {
    angular.forEach(manoStates, function(route, path) {
      if( route.authRequired ) {
        $stateProvider.whenAuthenticated(path, route);
      }
      else {
        $stateProvider.state(path, route);
      }
    });
    $urlRouterProvider.otherwise('/dashboard');
  }])

  .run(['$rootScope', '$state', '$location', 'Auth', 'manoStates', '$stateParams', '$cookies',
    function($rootScope, $state, $location, Auth, manoStates, loginRedirectPath, $stateParams, $cookies) {
      Auth.$onAuth(check);


      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        event.targetScope.$watch('$viewContentLoaded', function () {

          angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);

          setTimeout(function () {
            angular.element('#wrap').css('visibility','visible');

            if (!angular.element('.dropdown').hasClass('open')) {
              angular.element('.dropdown').find('>ul').slideUp();
            }
          }, 200);
        });
        $rootScope.containerClass = toState.containerClass;
      });

      $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        if (error === "AUTH_REQUIRED") {
          $state.go('login');
        }
      });


      function check(user) {
        if (!user && authRequired($location.path())) {
            $state.go('login', {}, {reload: true});
        }
      }

      function authRequired(path) {
        return securedRoutes.indexOf(path) !== -1;
      }

    }
  ]);