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

app.service('ManageService', function ManageService($http, urlBase) {
    return({
        addTerm: addTerm,
		removeTerm: removeTerm,
		getTerms: getTerms
	});

    function addTerm(term){
        return $http({
            method: 'PUT',
            url: (urlBase + '/lpa/' + term)
        });
    }

    function removeTerm(term){
        return $http({
            method: 'DELETE',
            url: (urlBase + '/lpa/' + term)
        });
    }
	
	function getTerms(){
        return $http({
            method: 'GET',
            url: (urlBase + '/lpa')
        });
    }
	
});
