const Config = use('Config')

const Urlpair = use('App/Model/Urlpair')

const UrlpairHelper = exports = module.exports = {}

UrlpairHelper.validateShortURL = function(string) {

	const regexp = new RegExp('^[A-z1-9]{1,}$', 'i');

	return !!string.match(regexp);
}

UrlpairHelper.delayedDeletion = function * () {

	const storeTime = Config.get('custom.urlpair.storeTime')
	const Database = use('Database')
	let urlpairData;

	while(true) {

		try {

			let queryResult = yield Database
				.raw('select id, now() - created_at as age from urlpairs order by created_at asc limit 0,1')

			urlpairData = queryResult.length && queryResult[0].length && queryResult[0][0];

			if(!urlpairData) {
				"no urlpairs, returning";
				return
			}

			yield new Promise(resolve => setTimeout(()=>resolve(), Math.max(0, storeTime - urlpairData.age)*1000))

			const urlpair = yield Urlpair.find(urlpairData.id);

			yield urlpair.delete()

		}
		catch(e) {

			//console.log(e)

			yield new Promise(resolve => setTimeout(()=>resolve(), 5000))

		}

	}
		

	return;

}

UrlpairHelper.createUrlPair = function * createUrlPair(original, shortURL = null) {

	function generateShortURL(length = Config.get('custom.urlpair.strLength')) {

		const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let url = "";

		for(let i = 0; i < length; i++) {
			url += chars.charAt(Math.floor(Math.random() * chars.length))
		}

		return url;

	}

	if(!shortURL) {

		do {
			shortURL = generateShortURL()
		}
		while(yield Urlpair.findBy('short_url', shortURL));

	}

	const urlpair = yield Urlpair.create({
    	original_url : original,
    	short_url : shortURL
    });

	return urlpair ? shortURL : null;

}