FROM php:8.3-apache

# Systempakete und PHP-Extensions
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev zip \
    && docker-php-ext-install intl opcache zip

# Apache Rewrite aktivieren
RUN a2enmod rewrite

# Composer installieren
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/symfony
