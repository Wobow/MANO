'use strict';

angular.module('muveApp')
  .controller('HomeCtrl', function ($scope, $controller, muveApi) {

    var MuveWorkFlowCtrl = function($scope, muveApi) {

      var self = this;
      self.__init = function() {
        $scope.loading = false;
        $scope.searchError = false;
        $scope.searchContent = undefined;
        $scope.searchFormatted = undefined;
        $scope.muve = undefined;
        $scope.selected = undefined;
        $scope.createFormatted = undefined;
        $scope.createContent = undefined;
        $scope.search = {};
      };

      $scope.searchMusic = function() {
        if ($scope.loading)
          return;
        $scope.loading = true;
        muveApi.searchMusic($scope.search)
        .then(function(res) {
          $scope.searchContent = res;
          $scope.loading = false;
          $scope.searchFormatted = JSON.stringify(res, null, ' ');
        }, function(err) {
          $scope.searchContent = err;
          $scope.searchError = true;
          $scope.loading = false;
          $scope.searchFormatted = JSON.stringify(err, null, ' ');
        });
      };

      $scope.select = function (elem) {
        $scope.muve = {music: elem.id};
        $scope.selected = elem;
      };

      $scope.submit = function() {
        if ($scope.loading)
          return;
        $scope.loading = true;
        muveApi.createMuve($scope.muve)
        .then(function(res) {
          $scope.createContent = res;
          $scope.loading = false;
          $scope.createFormatted = JSON.stringify(res, null, ' ');
        }, function(err) {
          $scope.createContent = err;
          $scope.loading = false;
          $scope.createFormatted = JSON.stringify(err, null, ' ');
        });
      };

      $scope.retry = self.__init;

      self.__init();
    };

    $scope.token = muveApi.$getToken();
    $scope.refreshToken = muveApi.$getRefreshToken();

  	$scope.modules = [
  		{
  			title: 'Muve creation workflow',
  			size: 'col-md-12',
  			templateUrl: 'views/modules/muve-workflow.html',
  			ctrl:  MuveWorkFlowCtrl
  		}
  	];
  });
