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

## UpUp Configuration

[UpUp](https://github.com/TalAter/UpUp) is a tool that enables browsers to download an offline version of a website so users can still access it if they lose internet connection. Because Parcel Bundler hashes every file accessed via reference within the code, you need to ensure that the UpUp configuration at the bottom of `index.html` is kept up to date whenever you make changes to files. Typically the only file hashes that will change are `src.*.js` and `main.*.css`, but it's best to check all of them just to make sure.

After bundling, update the files referenced in the configuration to make sure UpUp can download the files correctly, then bundle again so `dist/index.html` gets updated. I'm desperately hoping I can find a way to automate this in the build process, but I haven't figured it out just yet. Maybe I'll end up using `router.php` and `.htaccess` to do the heavy lifting for me. We'll see.