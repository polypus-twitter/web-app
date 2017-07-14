/*
    Polypus: a Big Data Self-Deployable Architecture for Microblogging
    Text Extraction and Real-Time Sentiment Analysis

    Copyright (C) 2017 Rodrigo Martínez (brunneis) <dev@brunneis.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var app = angular.module("polypus", ['ngRoute', 'chart.js']);

app.constant('urlBase', 'http://localhost:8080/api/1.0');

app.config(function ($routeProvider, $locationProvider, $httpProvider) {
	
    $routeProvider.when('/realtime', {
        templateUrl: 'app/views/RealtimeView.html',
        controller: 'RealtimeController',
		
    }).when('/explore', {
        templateUrl: 'app/views/ExploreView.html',
        controller: 'ExploreController',
		
    }).when('/search', {
        templateUrl: 'app/views/SearchView.html',
        controller: 'SearchController',
		
    }).when('/manage', {
        templateUrl: 'app/views/ManageView.html',
        controller: 'ManageController',

    }).otherwise({
        redirectTo: function () {
            window.location.href = '/realtime';
        }
    });
	
	// use the HTML5 History API
	$locationProvider.html5Mode(true);
	
}).run(['$rootScope', '$location', function($rootScope, $location){
   var path = function() { return $location.path();};
   $rootScope.$watch(path, function(newVal, oldVal){
     $rootScope.activetab = newVal;
   });
}]);
