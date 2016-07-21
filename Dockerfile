FROM node:latest
MAINTAINER sketchglass <sketchglass.team@gmail.com>
WORKDIR /respass
EXPOSE 8080 23000
ENTRYPOINT ["/respass/docker/bootup.sh"]
