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
		var url = "";

		for(var i = 0; i < length; i++) {
			url += chars.charAt(Math.floor(Math.random() * chars.length))
		}

		return url;

	}

	
	var shortURL;

	do {
		shortURL = generateShortURL()
	}
	while(shortURL == 'sdrgsdrg')

	const urlpair = yield Urlpair.create({
    	original_url : original,
    	short_url : shortURL
    });

	return urlpair ? shortURL : null;

}