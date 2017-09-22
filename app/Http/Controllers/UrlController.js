'use strict'

const Urlpair = use('App/Model/Urlpair')

const UrlpairHelper = require.main.require('./providers/UrlpairHelper');

const rp = require('request-promise');

class UrlController {

	* shortenUrl (request, response) {

		const postData = request.post();

		if(typeof postData.originalURL === 'undefined') {

			response.json({post: postData,error : 'Invalid input data'});
			return;

		}

		yield rp({url: postData.originalURL, followRedirect: true, simple: true, resolveWithFullResponse: true})
		    .then(function (ValidationResponse) {

		    	if(ValidationResponse.statusCode.toString()[0] !== '2') {

		    		response.json({error : 'Bad response status code:' + ValidationResponse.statusCode});
					return;

		    	}

		    	response.json({success : 1, shortUrl: 'qwerty'});
				return;

		    })
		    .catch(function (err) {

		        response.json({error: 'unable to resolve URL'});
				return;

		    });

		return;

	}

	* resolveShortUrl (request, response) {

		

	}

}

module.exports = UrlController
