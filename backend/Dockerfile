FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libssl-dev \
    pkg-config

# Install PHP extensions
RUN docker-php-ext-install mbstring exif pcntl bcmath gd

# Install MongoDB PHP Extension (Sangat Penting untuk aplikasi kita)
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy the Laravel files
COPY . .

# Install composer dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader --ignore-platform-req=ext-mongodb

# Expose port
ENV PORT=8000
EXPOSE 8000

# Start Laravel Server
CMD php artisan serve --host=0.0.0.0 --port=$PORT
