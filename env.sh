#!/bin/sh

# Replace environment placeholders in JS files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|SUPABASE_URL_PLACEHOLDER|${SUPABASE_URL}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|SUPABASE_KEY_PLACEHOLDER|${SUPABASE_KEY}|g" {} \;

# Start Nginx
nginx -g 'daemon off;'