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

app.controller('RealtimeController', function ($scope, $filter, $interval, RealtimeService) {

	loadTrending();
	handler = $interval(loadTrending, 30000);		
	
	function loadTrending(){
		/* OBTENCIÓN DE LOS TÉRMINOS RELEVANTES */
		$scope.terms = [];
		RealtimeService.getTrending()
		.success(function (data){
			$scope.terms = data;
				
			$scope.tarjetas = [];
			/* PARA CADA TÉRMINO RECUPERAR */
			for (var counter = 0; counter < $scope.terms.length; counter++){
				var stop = new Date().getTime();
				var start = stop - 3600000;
				
				RealtimeService.getTermResults($scope.terms[counter], start, stop)
				.success(function(data){
					//alert(data.total[0]);
					$scope.tarjetas.push({
						"term": data.search_query,
						"result": data.total[0],
						"posts": data.total[1]
					});
				});	
			}	
				
		});
	}

});
