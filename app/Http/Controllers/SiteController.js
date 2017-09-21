'use strict'

const Urlpair = use('App/Model/Urlpair')

class SiteController {

	* index (request, response) {

		yield response.sendView('home');
		return;

	}

}

module.exports = SiteController
