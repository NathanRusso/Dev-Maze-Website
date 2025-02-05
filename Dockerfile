# Grab the original image from docker hub
FROM docker.io/nginxinc/nginx-unprivileged

# Take our local nginx conf and replace it in the image filesystem
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all files from our local directory to the docker filesystem
# Repeat for all files/directories
COPY *.html /usr/share/nginx/html/
COPY CSS /usr/share/nginx/html/CSS
COPY JS /usr/share/nginx/html/JS
COPY favicon.ico /usr/share/nginx/html/
