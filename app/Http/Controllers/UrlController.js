'use strict'

const Urlpair = use('App/Model/Urlpair');

const Env = use('Env');

const UrlpairHelper = require.main.require('./providers/UrlpairHelper');

const UrlValidatorHelper = require.main.require('./providers/UrlValidatorHelper');

const rp = require('request-promise');

class UrlController {

	* shortenUrl (request, response) {

		const postData = request.post();
		let urlValidated = false;

		if(typeof postData.originalURL === 'undefined') {

			response.json({post: postData,error : 'Invalid input data'});
			return;

		}

		const originalUrl = (postData.originalURL.indexOf('://') === -1) ? 'http://' + postData.originalURL : postData.originalURL;

		yield rp({url: originalUrl, followRedirect: true, simple: true, resolveWithFullResponse: true})
		    .then(function (ValidationResponse) {

		    	if(ValidationResponse.statusCode.toString()[0] !== '2') {

		    		response.json({error : 'Bad response status code:' + ValidationResponse.statusCode});
					return;

		    	}

		    	urlValidated = true;
		    	return;

		    })
		    .catch(function (err) {

		        response.json({error: 'Unable to resolve URL'});
				return;

		});

		if(urlValidated) {

			try {

				const count = (yield Urlpair.query().count())[0]["count(*)"];

				const userShortURL = postData.shortURL;

				if(userShortURL) {
					if(!UrlValidatorHelper.validateShortURL(userShortURL)) {
						return response.json({error : 'Invalid short url'});
					}
					if(yield Urlpair.findBy('short_url', userShortURL)) {
						return response.json({error : 'Suggested short url already exists'});
					}
				} 

				const shortUrl = (yield UrlpairHelper.createUrlPair(originalUrl, userShortURL));

				if(shortUrl) {

					response.json({
						success : 1, 
						shortUrl : request.hostname() + (Env.get('PORT') ? ':' + Env.get('PORT') : '')+ '/' + shortUrl
					});

					if(!count) {
						yield UrlpairHelper.delayedDeletion();
					}
				}
				else {
					return response.json({error : 'internal error'});
				}

		    } 
		    catch(e) {

		    	//console.log(e)

				return response.json({error : 'internal error'});
		    }

		    return;

		}

	}

	* resolveShortUrl (request, response) {

		const shorturl = request.param('shorturl');

		if(typeof shorturl === 'undefined') {

			return response.redirect('/');

		}

		const urlpair = yield Urlpair.findBy('short_url', shorturl);

		if(!urlpair) {

			return response.redirect('/');

		}

		response.redirect(urlpair.original_url);

		urlpair.hit_count++;
		yield urlpair.save()

		return;
	}

}

module.exports = UrlController
