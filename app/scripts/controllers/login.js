'use strict';

angular.module('muveApp')
  .controller('LoginCtrl', function ($scope, muveApi, Auth, $state) {
  	$scope.login = function() 
  	{
  		if ($scope.loading)
  			return;
  		$scope.error = false;
  		$scope.loading  = true;
  		Auth.$authWithPassword($scope.credentials).then(function(res) {
  			console.log(res);
  			$state.go('dashboard');
  		}, function(err) {
  			$scope.error = true;
  			$scope.loading = false;
  		})
  	}
  });
