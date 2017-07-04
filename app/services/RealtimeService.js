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

app.service('RealtimeService', function RealtimeService($http, urlBase) {
    return({
        getTrending: getTrending,
		getTermResults: getTermResults
	});

	/* Los más activos en la última hora */
    function getTrending(){
        return $http({
            method: 'GET',
            url: (urlBase + '/lpa/trending?no=6&min=60')
        });
    }
	
	function getTermResults(term, start, stop){
		return $http({
			method: 'GET',
            url: (urlBase + '/lpa/' + term + '/results?b=' + start + '&e=' + stop)
		});
	}

});
