# Lexiconga

This is the light-as-possible rewrite of Lexiconga.

## Installation

0. Some dev tools require build tools.
  - On Windows, install them with `npm install --global windows-build-tools`.
  - Alternatively, you can just install the newest Python and Visual Studio (with Desktop C++ devkit).
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

Parcel Bundler version < 2 doesn't use PostCSS 8+, so upgrading autoprefixer will not work. Keep autoprefixer at the highest version within the 9 major version until you're able to figure out how parcel-bundler 2+ works.

## Production

`npm run bundle` bundles and minifies the frontend stuff and also copies the backend stuff to `dist`. Be sure to run `npm run clear` to delete the contents of `dist` and `.cache` before using `npm run bundle` to make sure you don't get old dev versions of the bundled code included in your upload.

## Migration

There is a script called `src/php/api/migrate.php.changeme` that can be used to help with the migration process from a `version1` Lexiconga database into a `master` database. **Note:** Migration is intended only for migrating from an old server to a freshly-installed/empty new database. To use this, copy `src/php/api/migrate.php.changeme` to `migrate.php` somewhere in the `version1` project (probably in `/php`) and copy the same to `/api/migrate.php` in your `master` project, making sure that all the variables for referencing the databases are correct.

Visit `migrate.php` on your `version1` server with `?outgoing=true` set in order to begin the transfer. The other server's `migrate.php` will receive an "incoming" request multiple times, and your screen will display messages as it works.

_DELETE THESE `migrate.php` FILES IMMEDIATELY AFTER MIGRATION IS COMPLETE!_.

## Emails

Be sure you set up email senders/receivers for at least these 3 email addresses:

- help (can be forwarder)
- donotreply (must be sender)
