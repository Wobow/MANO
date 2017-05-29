'use strict';
angular.module('muveApp')
.factory('Auth', ['$q', '$http', 'muveApi', '$cookies', function($q, $http, muveApi, $cookies) {

	var auth = {};
	auth.$onAuth = function(callback) {
		auth.onAuthCallback = callback;
	};
	auth.$waitForAuth = function() {
		var defer = $q.defer();
		if (auth.user) {
			defer.resolve(auth.user);
			auth.onAuthCallback(auth.user);
		} else if ($cookies.get('muve_mano_token')) {
            auth.$authWithToken($cookies.get('muve_mano_token'))
            .then(function(success) {  
      			if ($cookies.get('muve_mano_refreshtoken')) {
					muveApi.$setRefreshToken($cookies.get('muve_mano_refreshtoken'));
      			}   	
				defer.resolve(auth.user);
				auth.onAuthCallback(auth.user);
            }, function(error) {
      			$cookies.remove('muve_mano_token');
      			if ($cookies.get('muve_mano_refreshtoken')) {
      				auth.$authWithRefreshToken($cookies.get('muve_mano_refreshtoken'))
      				.then(function(success) {
      					defer.resolve(auth.user);
      				}, function(error) {
      					$cookies.get('muve_mano_refreshtoken');
						defer.reject('Session has expired');
      				})
      			} else {
					defer.reject('Session has expired');
      			}
            });
		} else {
			defer.reject('User not authenticated');
		}
		return defer.promise;
	};
	auth.$unauth = function() {
      	$cookies.remove('muve_mano_token');
      	$cookies.remove('muve_mano_refreshtoken');
      	muveApi.$logout();
		delete auth.user;
	};
	auth.$saveToken = function(token, refreshToken) {
		muveApi.$setToken(token);
		muveApi.$setRefreshToken(refreshToken);
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() + 1);
		$cookies.put('muve_mano_token', token);
		$cookies.put('muve_mano_refreshtoken', refreshToken);
	}

	auth.$authWithRefreshToken = function(refreshToken) {
		var defer = $q.defer();
		if (!refreshToken) {
			defer.reject("Credentials are missing");
		} else {
			muveApi.login({grant_type: 'refresh_token', refresh_token: refreshToken})
			.then(function(response) {
				var res = response.data;
				auth.$saveToken(res.access_token, refreshToken);
				auth.$authWithToken(res.access_token)
				.then(function(data) {
					defer.resolve(data);
				}, function(err) {
					defer.reject(err);
				});
			}, function(err) {
				defer.reject(err);
			});
		}
		return defer.promise;
	};
	auth.$authWithToken = function(token) {
		var defer = $q.defer();
		muveApi.$setToken(token);
		muveApi.getMe()
		.then(function(user) {
			auth.user = user.data;
			defer.resolve(auth.user);
			auth.onAuthCallback(auth.user);
		}, function(err) {
			defer.reject(err);
		});
		return defer.promise;
	};
	auth.$authWithPassword = function(credentials) {
		var defer = $q.defer();
		if (!credentials.password || !credentials.email) {
			defer.reject("Credentials are missing");
		} else {
			muveApi.login({grant_type: 'password', email: credentials.email, password: credentials.password})
			.then(function(response) {
				var res = response.data;
				auth.$saveToken(res.access_token, res.refresh_token);
				auth.$authWithToken(res.access_token)
				.then(function(data) {
					defer.resolve(data);
				}, function(err) {
					defer.reject(err);
				});
			}, function(err) {
				defer.reject(err);
			});
		}
		return defer.promise;
	};
	auth.$createUser = function(infos) {
		return null;
	};
	auth.$requireAuth = function() {
		var defer = $q.defer();
		defer.resolve(auth.user);
		return defer.promise;
	};
	return auth;
}]);