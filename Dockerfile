FROM ghcr.io/static-web-server/static-web-server:2

COPY build/client /public
COPY sws.toml /sws.toml

ENV SERVER_ROOT=/public
ENV SERVER_CONFIG_FILE=/sws.toml
ENV SERVER_ERROR_PAGE_404=/public/404/index.html
ENV SERVER_LOG_LEVEL=warn

EXPOSE 80
