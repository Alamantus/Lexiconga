# Lexiconga

This is the light-as-possible rewrite of Lexiconga.

## Installation

1. Clone and run `yarn` and `composer install` to install dependencies.
1. Import `src/structure.sql` into a database called 'lexiconga' on your MariaDB server to get the database structure.
1. Copy `src/php/api/config.php.changeme` to `src/php/api/config.php` and update the values within to enable connections to your lexiconga database.

### Requirements

* [Yarn](https://yarnpkg.com/) 1.12.3+
* [PHP](https://php.net/) 7.2.18+
* [Composer](https://getcomposer.org/) 1.8.5+
* [MariaDB](https://mariadb.org/) 10.1.37+
* [Apache](https://httpd.apache.org/) 2.4+

## Development

`npm start` bundles and watches frontend and backend changes. Set up a junction link to `dist` from the root of your php-processing web server.

It's less useful, but `npm run serve-frontend-only` will bundle and serve _only_ the front end stuff from `localhost:1234`. The bundled files all still get bundled into `dist`.

## Production

`npm run bundle` bundles and minifies the frontend stuff and also copies the backend stuff to `dist`. Be sure to run `npm run clear` to delete the contents of `dist` and `.cache` before using `npm run bundle` to make sure you don't get old dev versions of the bundled code included in your upload.
