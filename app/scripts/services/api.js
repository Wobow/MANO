'use strict';

angular.module('muveApp')
	.factory('muveApi', function($http, $cookies) {
		var api = {
			conf : {
				cookie: 'muve_mano_token',
				uri: 'http://localhost:1337',
				routes: {
					login: '/login',
					register: '/register',
					me: '/me',
					search: '/musics/search',
					muve: '/muves',
					users: '/users',
					follows: '/follows',
					feed: '/activities',
				},
			},
		};
	
		api.$getUri = function() {
			return (api.conf.uri);
		};
		api.$setProfile = function(user) {
			api.user = user;
		};
		api.$getProfile = function() {
			return api.user;
		};
		api.$isConnected = function() {
			return (api.conf.isConnected && api.conf.token) || false;
		};
		api.$setRefreshToken = function(token) {
			api.conf.refreshToken = token;
		};
		api.$setToken = function(token) {
			api.conf.token = token;
		};
		api.$getToken = function(token) {
			return api.conf.token;
		};
		api.$getRefreshToken = function() {
			return api.conf.refreshToken;
		};
		api.$logout = function() {
			api.conf.isConnected = false;
			api.conf.token = undefined;
			api.user = undefined;
			$cookies.remove(api.conf.cookie);
		};
		api.sendRequest = function(type, route, params, query, overrideUri) {
			return $http({
				method: type,
				url: (overrideUri || api.conf.uri) + route,
				data: params,
				params: query,
				headers: {
					Authorization: 'Bearer ' + api.conf.token,
				}
			});
		};

		// Routes

		api.register = function(credentials) {
			return api.sendRequest('POST', api.conf.routes.register, credentials);
		};
		api.login = function(credentials) {
			return api.sendRequest('POST', api.conf.routes.login, credentials);
		};
		api.getMe = function() {
			return api.sendRequest('GET', api.conf.routes.me);
		};
		api.searchMusic = function(query) {
			return api.sendRequest('GET', api.conf.routes.search, null, query);
		};
		api.createMuve = function(muve) {
			return api.sendRequest('POST', api.conf.routes.muve, muve);
		};
		api.getMuvesAround = function(lat, lng) {
			return api.sendRequest('GET', api.conf.routes.muve, null, {lat: lat, lng: lng});
		};
		api.searchUsers = function(query) {
			return api.sendRequest('GET', api.conf.routes.users, null, {q: query});
		};
		api.follow = function(id) {
			return api.sendRequest('POST', api.conf.routes.follows, {friend: id});
		};
		api.unfollow = function(id) {
			return api.sendRequest('DELETE', api.conf.routes.follows + '/' + id);
		};
		api.getMyFeed = function(page) {
			return api.sendRequest('GET', api.conf.routes.feed, null, {page: page});
		};
		return api;
	});