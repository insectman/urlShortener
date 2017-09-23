const UrlValidatorHelper = exports = module.exports = {}

UrlValidatorHelper.validateShortURL = function(string) {

	const regexp = new RegExp('^[A-z1-9]{1,}$', 'i');

	return !!string.match(regexp);
}