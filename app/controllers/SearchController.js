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

app.controller('SearchController', function ($scope, $filter, $interval, SearchService) {
	
	/* Flags para mostrar/ocultar divs */
	$scope.processing = false
	$scope.processed = false

	var today = new Date();
	var yesterday = today - new Date(86400000);
	
	$scope.start = $filter('date')(yesterday,'dd-MM-yyyy HH:mm:ss');
	$scope.stop = $filter('date')(today,'dd-MM-yyyy HH:mm:ss');
	
	$scope.form = {
		"language": "en"
	}
	
	
	var handler;
	$scope.submit = function() {
		var dateTimeParts = $scope.start.split(' '),
		timeParts = dateTimeParts[1].split(':'),
		dateParts = dateTimeParts[0].split('-'),
		date,
		start;
		$scope.form.start_timestamp = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]).getTime();

		dateTimeParts = $scope.stop.split(' '),
		timeParts = dateTimeParts[1].split(':'),
		dateParts = dateTimeParts[0].split('-'),
		date,
		stop;
		$scope.form.stop_timestamp = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]).getTime();
		
		if($scope.form.search_query.length != 0) {	
		
			$scope.processing = true
			
			SearchService.submitJob($scope.form)
			.success(function (data) {
				$scope.job_id = data.meta
				/* Cada medio segundo */
				handler = $interval(checkAndPrint, 500);	
			})
			.error(function(){
				Materialize.toast('Ha ocurido un error');
			});			
		}
	}
	
	function checkAndPrint(){
		SearchService.getResultById($scope.job_id)
		.success(function (data) {
			
			$interval.cancel(handler);
			
			$scope.processed = true
			$scope.processing = false
			
			result = angular.fromJson(data);
			
			/* LOS OBJETOS NO ESTÁN ORDENADOS */
			var windows = result.windows;
			var keys = Object.keys(result.windows);
			keys.sort(); 

			/* SE ACTUALIZA EL CAJETÍN DE BÚSQUEDA CON LA RESPUESTA OBTENIDA */
			$scope.search_query = result.search_query;
			
			
			$scope.labels = [];
			var auxSentiment = [];
			var auxRelevance = [];
			for (var counter = 0; counter < keys.length; counter++) {
				$scope.labels.push($filter('date')(keys[counter], 'dd-MM-yy [HH:mm:ss]'));
				auxSentiment.push(windows[keys[counter]].polarity);
				auxRelevance.push(windows[keys[counter]].matches);
			}
			
			$scope.data = []
			$scope.data.push(auxSentiment)
			$scope.data.push(auxRelevance)
			
			$scope.series = ['Avg. polarity', 'No. of posts'];
			
			$scope.onClick = function (points, evt) {
				console.log(points, evt);
			};
			$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
			
			$scope.colors = ['#0091ea','#8a8c8e'];
			
			$scope.options = {
				legend: {
					display: true,
						labels: {
							fontColor: 'rgb(255, 255, 255)'
						}
				},
				scales: {
					yAxes: [
						{
							id: 'y-axis-1',
							type: 'linear',
							display: true,
							position: 'right'
						},
						{
							id: 'y-axis-2',
							type: 'linear',
							display: true,
							position: 'left'
						}
					]
				}
			};				
		})
	}	
  
});
