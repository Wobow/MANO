'use strict';

angular.module('muveApp')
	.constant('manoStates', {
      	'dashboard' : {
      		url: '/dashboard',
	      	templateUrl: 'views/main.html',
	      	controller: 'HomeCtrl',
	      	controllerAs: 'ctrl',
	      	authRequired: true
	    },	    
      	'login' : {
      		url: '/login',
	      	templateUrl: 'views/login.html',
	      	controller: 'LoginCtrl',
	      	controllerAs: 'ctrl',
	    },
	});