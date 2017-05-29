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
  			$state.go('dashboard');
  		}, function(err) {
  			$scope.error = true;
  			$scope.loading = false;
  		})
  	}

    $scope.register = function() 
    {
      if ($scope.loading)
        return;
      $scope.errorRegister = false;
      $scope.loading  = true;
      muveApi.register($scope.credentialsRegister)
      .then(function(res) {        
        Auth.$authWithPassword($scope.credentialsRegister).then(function(res) {
          $state.go('dashboard');
        }, function(err) {
          $scope.errorRegister = true;
          $scope.loading = false;
        })
      }, function(err) {
        $scope.errorRegister = true;
        $scope.loading = false;
      });
    }
  });
