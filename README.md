# Lexiconga

The quick and easy dictionary builder for constructed languages.

## About

This is the master branch for the full rewrite of Lexiconga using modern development practices.

The source code for the current version of Lexiconga (http://lexicon.ga) is saved in the `version1` branch.

## Requirements

- Git: latest
- Node: 8.9.3+
- NPM/Yarn: latest
- PHP: 5.4.45+
- Composer: 1.5.6+
- MySQL: 5.5.51-38.2+

## Development

Setting up the dev environment takes a few steps, but it's pretty simple, all things considered. I use Windows to develop, but you should be able to use whatever environment you want--it's just up to you to figure out what to do to serve the files+PHP+MySQL.

First, clone the repository with `git clone`, then initialize the dependencies. Run `yarn` from the root of the Lexiconga directory (`npm install` also works, but [Yarn](https://yarnpkg.org) is just generally better at managing dependencies) to install the JavaScript dependencies, then run `composer install` from the `public/api` directory to install the PHP dependencies.

Now that the dependencies are installed, run WAMP or some other local server that will serve PHP and MySQL for you and point a junction link named `lexiconga` from the server's `www` or `http` folder to the `public` directory in the Lexiconga project. This should allow you to load Lexiconga from http://localhost/lexiconga!

Next, you need to set up the MySQL database. In `public/api`, you should find a `structure.sql` file that contains the database structure. You should be able to import the `.sql` file directly into a database called `lexiconga` and go on your merry way.

Finally, once it's all set up, just run `npm run watch` to start Webpack's file watcher so changes made will compile into the `public` folder, allowing you to simply refresh the webpage any time you make a change.

## Problems or Requests
Please report any problems you come across to the [Lexiconga Issues page](http://lexicon.ga/issues). You can also submit enhancement requests to the same place if you have any requests for new features.

## Update Log
You can see all previous updates to Lexiconga here:
[http://lexicon.ga/updates](http://lexicon.ga/updates)

## Thanks!
If you like Lexiconga and want to buy me a cup of coffee for the service, you can **[donate throughPaypal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=MCCSYGQCR5TLY&lc=US&item_name=Lexiconga&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)** to help keep it online if you want.

I hope you enjoy Lexiconga and that it helps you build some awesome languages.

–Robbie Antenesse
