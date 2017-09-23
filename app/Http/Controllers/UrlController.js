'use strict'

const Urlpair = use('App/Model/Urlpair');

const Env = use('Env');

const UrlpairHelper = require.main.require('./providers/UrlpairHelper');

const UrlValidatorHelper = require.main.require('./providers/UrlValidatorHelper');

const rp = require('request-promise');

const CatLog = require('cat-log')

const log = new CatLog()

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

		    		let errorText = 'Bad response status code:' + ValidationResponse.statusCode;

		    		log.info('Error validating original url: ' + errorText);
		    		return response.json({error : errorText});

		    	}

		    	urlValidated = true;
		    	return;

		    })
		    .catch(function (err) {

		    	log.warn('Error validating original url: ' + err);
		        return response.json({error: 'Unable to resolve URL'});

		});

		if(urlValidated) {

			try {

				const count = (yield Urlpair.query().count())[0]["count(*)"];

				const userShortURL = postData.shortURL;

				if(userShortURL) {
					if(!UrlValidatorHelper.validateShortURL(userShortURL)) {

						log.info('Invalid short url: ' + userShortURL);
						return response.json({error : 'Invalid short url'});
					}
					if(yield Urlpair.findBy('short_url', userShortURL)) {

						log.info('User tried to add existing short url: ' + userShortURL);
						return response.json({error : 'Suggested short url already exists'});

					}
				} 

				const shortUrl = (yield UrlpairHelper.createUrlPair(originalUrl, userShortURL));

				if(shortUrl) {

					log.info('db entry created successfully for short url: ' + userShortURL);

					response.json({
						success : 1, 
						shortUrl : request.hostname() + (Env.get('PORT') ? ':' + Env.get('PORT') : '')+ '/' + shortUrl
					});

					if(!count) {
						yield UrlpairHelper.delayedDeletion();
					}
				}
				else {

					log.warn('Failed to create db entry for short url: ' + userShortURL);
					return response.json({error : 'internal error'});
				}

		    } 
		    catch(e) {

		    	log.error('Error creating short url db entry: ' + userShortURL);

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

			log.info('Trying to resolve short url that doesn\'t exist in db: ' + shorturl);
			return response.redirect('/');

		}

		response.redirect(urlpair.original_url);

		urlpair.hit_count++;

		log.info('Short url resolved successfully: ' + shorturl + ', hit count: ' + urlpair.hit_count);
		yield urlpair.save()

		return;
	}

}

module.exports = UrlController
