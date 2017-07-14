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

app.controller('ExploreController', function ($scope, $filter, $interval, ExploreService) {
	
	/* Flags para mostrar/ocultar divs */
	$scope.processing = false
	$scope.processed = false


	/* DATOS DEL FORMULARIO INICIALES, LAS FECHAS NO SE USAN DIRECTAMENTE */
	var today = new Date();
	var yesterday = today - new Date(86400000);
	$scope.form = {
		"start_timestamp": $filter('date')(yesterday,'dd-MM-yyyy HH:mm:ss'),
		"stop_timestamp": $filter('date')(today,'dd-MM-yyyy HH:mm:ss'),
		"language": "en"
	}	


	/* OBTENCIÓN DE LA LISTA LPA */	
	ExploreService.getTerms($scope)
	.success(function (data) {
		$scope.lpa = data;
		$scope.lpa.sort();
		$scope.selected_term = $scope.lpa[0];
	});
	
	/* SELECCIÓN DE TÉRMINO */
	$scope.select = function(item) { 
		$scope.selected_term = item;  
	}
	

	$scope.submit = function() {
		/* CONVERSIÓN FECHA HUMANA A TIMESTAMP */
		var dateTimeParts = $scope.form.start_timestamp.split(' '),
		timeParts = dateTimeParts[1].split(':'),
		dateParts = dateTimeParts[0].split('-'),
		date,
		start;
		start = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]).getTime();

		dateTimeParts = $scope.form.stop_timestamp.split(' '),
		timeParts = dateTimeParts[1].split(':'),
		dateParts = dateTimeParts[0].split('-'),
		date,
		stop;
		stop = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]).getTime();
	
		// $scope.processing = true;		
		$scope.processed = false

		ExploreService.getTermResults($scope.selected_term, start, stop)
		.success(function (data) {					
			if(data.total[1] > 0) {
				printChart(data);					
			} else {
				$scope.processing = false;	
				Materialize.toast('No se han obtenido resultados para el término \'' + $scope.selected_term + '\'', 4000)					
			}										
		})
		.error(function(){
			Materialize.toast('Ha ocurido un error');
		});
	}
	
	
	function voidChart(){
		$scope.processed = false;
		$scope.labels = [];
		$scope.data = [];
		$scope.series = [];
	}
	
	
	function printChart(data){
		$scope.processed = true;
		$scope.processing = false
		
		result = angular.fromJson(data);
		
        var total = result.total;
        $scope.total_polarity = total[0];
        $scope.total_posts = total[1];
		
		/* LOS OBJETOS NO ESTÁN ORDENADOS */
		var blocks = result.blocks;
		var keys = Object.keys(result.blocks);
		keys.sort(); 
	
		$scope.labels = [];
		var auxSentiment = [];
		var auxRelevance = [];
		for (var counter = 0; counter < keys.length; counter++) {
			$scope.labels.push($filter('date')(keys[counter], 'dd-MM-yy [HH:mm:ss]'));
			auxSentiment.push(blocks[keys[counter]][0]);
			auxRelevance.push(blocks[keys[counter]][1]);
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
						position: 'left',
						ticks: {min: 0, max: 1}
					},
					{
						id: 'y-axis-2',
						type: 'linear',
						display: true,
						position: 'right'
					}
				]
			}
		};	
	
		
	}
	
});
