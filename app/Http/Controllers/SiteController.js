'use strict'

const Urlpair = use('App/Model/Urlpair')

class SiteController {

	* index (request, response) {

		const csrf = request.csrfToken();

		yield response.sendView('home', {csrf});
		return;

	}

}

module.exports = SiteController
