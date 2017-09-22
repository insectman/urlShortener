const Config = use('Config')

const Urlpair = use('App/Model/Urlpair')


const UrlpairHelper = exports = module.exports = {}

UrlpairHelper.delayedDeletion = function(urlpairId) {

	//Config.get('custom.urlpair.storeTimeMS')

	return;

}

UrlpairHelper.createUrlPair = function *createUrlPair(original) {

	//Config.get('custom.urlpair.storeTimeMS')

	function generateShortURL(length = 8) {

		const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
		let url = "";

		for(let i = 0; i < length; i++) {
			url += chars.charAt(Math.floor(Math.random() * chars.length))
		}

		return url;

	}

	let shortURL;

	do {
		shortURL = generateShortURL()
	}
	while(yield Urlpair.findBy('short_url', shortURL))

	const urlpair = yield Urlpair.create({
    	original_url : original,
    	short_url : shortURL
    });

	return urlpair ? shortURL + t + f  : null;

}