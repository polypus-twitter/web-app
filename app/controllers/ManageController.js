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

app.controller('ManageController', function ($scope, $filter, $interval, ManageService) {
	
	/* OBTENCIÓN DE LA LISTA LPA */	
	ManageService.getTerms($scope)
	.success(function (data) {
		$scope.lpa = data;
		$scope.lpa.sort();
	});
	
	/* ELIMINACIÓN TÉRMINO LPA */
	$scope.remove = function(item) { 
		ManageService.removeTerm(item)
		.success(function (){
			var index = $scope.lpa.indexOf(item);
			$scope.lpa.splice(index, 1);
			Materialize.toast('Keyword deleted', 4000);					
		});
	}
	
	/* AÑADIR TÉRMINO A LA LPA */
	$scope.add = function(item) { 
		ManageService.addTerm(item)
		.success(function (){
			if ($scope.lpa.indexOf(item) > -1){
				Materialize.toast('The keyword already exists', 4000);
			} else {
				$scope.lpa.push(item);
				$scope.lpa.sort();
				Materialize.toast('Keyword added', 4000);
			}
			$scope.term = "";
		});
	}	
	
});
