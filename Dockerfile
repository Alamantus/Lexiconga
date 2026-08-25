FROM php:8.2-apache
# Enable Apache modules
RUN a2enmod rewrite
# Install composer dependencies
RUN apt update && apt upgrade -y && apt install -y git curl libzip-dev zip unzip libonig-dev
# Install Node
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt update && apt-get install -y nodejs
# Install any extensions you need
RUN docker-php-ext-install mysqli pdo pdo_mysql zip bcmath mbstring
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Set the working directory to /var/www
WORKDIR /var/www
# Copy the source code into the container at /var/www
COPY ./ .