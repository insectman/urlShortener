## urlShortener is a very simple app that allows users to shorten their original urls and share shortened urls with other users.

By default, it uses MYSQL database. Database configuration can be altered in ./config/database.js

Database credentials are set in .env file.
Properties that you'll need are:

DB_CONNECTION
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_DATABASE

run 'npm install' from the root dir to install all dependencies

To perform migration, use the following command from the root dir:

./ace migration:run

(for windows:)
node ./ace migration:run

Some app configuration is available at ./config/custom.js, 
namely default lentgth for generated urls and default url storing time in seconds (before entry gets deleted)

To run the app, use:

npm run serve 

or 

npm run serve:dev

from the root dir.



Amount of short url usage is stored in hit_count field od the 'urlpairs' table.

API for short url creation is represent by sole method:

# Shorten Method

	POST shorten

## Parameters

### Mandatory attributes:

- **originalURL** — URL to shorten

### Optional attributes:

- **shortURL** — suggested short URL

## Return format
A JSON-encoded object including 'error' and 'success' keys, where 'error' should be empty and 'success' should equal to 1.
In case of success, the object should also include 'shortUrl' key equal to short url string



## Example
**Request**

    POST shorten?originalURL=ya.ru,shortURL=2j45gf34


**Return**
``` json
{
  success : 1, 
  shortUrl : https://yourcoolsite.com/2j45gf34
}