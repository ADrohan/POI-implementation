# Web Dev - Poi Assignment 2

### API Implementation and Security
_________
Following on from POI Assignment 1

"This Poi app allows users to upload information and photographs about 'Walking Places of Interest' in Waterford County, created as part of the HDip in Computer Science course at WIT.

Note: a precursor to this git repository is the repository _enterprise-web-dev-assign1a_"

--------
### Poi Core Features
* Sign up / login / logout
* Update User account settings
* Create / View / Delete Pois with follwing characteristics: Name, description, location, category supporting image upload / view and delete
* Public Galley
* Current weather

## Plugins and Frameworks Used

| Name | Function |
| ---- | ----|
| Hapi framework | Node.js framework |
|hapi/inert| static file and directory handler |
|hapi/cookie| plugin for cookies|
|hapi/vision| templates rendering support|
|hapi/joi| validation|
|boom| error messages|
|Dotenv| local storage of environmental variables|
| Handlebars| templating engine|
| UiKit | Front end framework|
| Fontawsome | Icon set |
|Mongoose| framework to interact with Mongo|
|Cloudinary| uploading and storage of images|
|Mais-Mongoose-seeder| seeding data|
|Bycrypt| salting and hashing of passwords|
|sanitize-html| HTML sanitizer|
|hapi-auth-jwt and jsonwebtoken| token based authentication|
|lodash| utility library|
|Chai| Assertion library for use with mocha|
|Mocha| javascript test framework|
|Axios| promise based HTTP client for javascript|

### .env file
The app initialises from a .env file to separate secrets from your source code.
Required in this .env file are cookie, mongoose, cloudinary and open weather details.

**Cookie**
* cookie_name=name
* cookie_password=your_secret_password

**Cloudinary**
https://cloudinary.com/ link your app with the following details provided by Cloudinary

* name=cloudinary-account-name
* key=your-key
* secret=your-secret-key

**Mongoose**
* db=mongodb+srv://paste-your-database-link-here

**Open Weather**
* apiKey=your-api-key