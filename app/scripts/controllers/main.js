'use strict';

angular.module('muveApp')
  .controller('HomeCtrl', function ($scope, $controller, muveApi, Auth, $state) {

    var MuveWorkFlowCtrl = function($scope, muveApi) {

      var self = this;
      var showPosition = function(position) {
        $scope.position = position.coords; 
        ($scope.muve || ($scope.muve = {})).lat = $scope.position.latitude;
        ($scope.muve || ($scope.muve = {})).lng = $scope.position.longitude;
      };
      navigator.geolocation.getCurrentPosition(showPosition);
      self.__init = function() {
        $scope.loading = false;
        $scope.searchError = false;
        $scope.searchContent = undefined;
        $scope.searchFormatted = undefined;
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
        ($scope.muve || ($scope.muve = {})).music = elem.id;
        $scope.selected = elem;
        console.log($scope.muve);
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

    var MuveMapCtrl = function($scope, uiGmapGoogleMapApi, muveApi) {
      var self = this;
      this.showPosition = function(position) {
        $scope.position = {latitude: position.coords.latitude, longitude: position.coords.longitude};   
        $scope.map = { center: $scope.position, zoom: 15 };       
        self.loadMuves();
      };

      uiGmapGoogleMapApi.then(function(maps) {
        $scope.maps = maps;
      });

      self.loadMuves = function() {
        muveApi.getMuvesAround($scope.position.latitude, $scope.position.longitude)
        .then(function(muves) {
          $scope.markers = muves.data.results;
        }, function(err) {
          console.log(err);
        });
      };

      $scope.$on('reloadMuves', self.loadMuves);

      navigator.geolocation.getCurrentPosition(this.showPosition);
    };

    var UserListCtrl = function($scope, muveApi) {
      self.searchUsers = function(query) {
        muveApi.searchUsers(query)
        .then(function(res) {
          $scope.users = res.data;
        });
      };

      $scope.follow = function(id) {
        muveApi.follow(id)
        .then(function(res) {
          self.searchUsers();
        });
      };

      $scope.unfollow = function(id) {
        muveApi.unfollow(id)
        .then(function(res) {
          self.searchUsers();
        });
      };

      self.searchUsers();
    };


    var FeedCtrl = function($scope, muveApi) {
      self.loadFeedFirstTime = function() {
        muveApi.getMyFeed(0)
        .then(function(res) {
          $scope.feed = res.data.activities;
          console.log($scope.feed);
        });
      };

      $scope.refresh = self.loadFeedFirstTime;

      self.loadFeedFirstTime();
    };

  	$scope.modules = [
  		{
  			title: 'Muve creation workflow',
  			size: 'col-md-12',
  			templateUrl: 'views/modules/muve-workflow.html',
  			ctrl:  MuveWorkFlowCtrl,
        hide: true
  		},
      {
        title: 'Muve map',
        size: 'col-md-12', 
        templateUrl: 'views/modules/muve-map.html',
        ctrl: MuveMapCtrl,
        hide: true
      },
      {
        title: 'User list',
        size: 'col-md-12', 
        templateUrl: 'views/modules/user-list.html',
        ctrl: UserListCtrl,
        hide: true
      },
      {
        title: 'Activity Feed',
        size: 'col-md-12', 
        templateUrl: 'views/modules/feed.html',
        ctrl: FeedCtrl
      },
  	];

    self.__init = function() {      
      $scope.token = muveApi.$getToken();
      $scope.refreshToken = muveApi.$getRefreshToken();
      $scope.timeLeft = JSON.parse(atob($scope.token.split('.')[1])).exp - Math.floor(Date.now() / 1000);
      $scope.initialTime = 24*60;
      $scope.$broadcast('timer-start');
    }

    $scope.logout = function() {
      Auth.$unauth();
      $state.go('login');
      $scope.hideTokens = false;
    };
    $scope.reconnect = function() {
      Auth.$authWithRefreshToken($scope.refreshToken)
      .then(function(res) {
        self.__init();
      });
      $scope.hideTokens = false;
    };
    self.__init();
    $scope.$on('timer-stopped', function (event, data){
      $scope.reconnect();
    });
  })
  .controller('MapCtrl', function($scope) {
    $scope.reloadMuves = function() {
      $scope.$emit('reloadMuves');
    }
  });
