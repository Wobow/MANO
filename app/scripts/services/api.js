'use strict';

angular.module('muveApp')
	.factory('muveApi', function($http, $cookies) {
		var api = {
			conf : {
				cookie: 'muve_mano_token',
				uri: 'http://localhost:1337',
				routes: {
					login: '/login',
					me: '/me',
					search: '/musics/search',
					muve: '/muves'
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
		api.$getRefreshToken = function(token) {
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
		return api;
	});