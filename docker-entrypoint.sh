#!/usr/bin/env sh
#
# Entrypoint for a container
#

# Fix Auth0's configurations
[[ -z "${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN}" ]] \
  && NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN="dataware-tools.us.auth0.com"
[[ -z "${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID}" ]] \
  && NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID="ETb1RhJEbtXlFgWtaHzl5kPCkaYqhTVl"
[[ -z "${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_API_URL}" ]] \
  && NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_API_URL="https://demo.dataware-tools.com/"
[[ -z "${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_MANAGE_PAGE}" ]] \
  && NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_MANAGE_PAGE="https://manage.auth0.com/dashboard/us/dataware-tools/users"

sed -i -e "s/ETb1RhJEbtXlFgWtaHzl5kPCkaYqhTVl/${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID}/g" .next/static/chunks/**/*.js
sed -i -e "s/dataware-tools.us.auth0.com/${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN}/g" .next/static/chunks/**/*.js
sed -i -e "s|https://demo.dataware-tools.com/|${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_CONFIG_API_URL}|g" .next/static/chunks/**/*.js
sed -i -e "s|https://manage.auth0.com/dashboard/us/dataware-tools/user|${NEXT_PUBLIC_DATAWARE_TOOLS_AUTH_MANAGE_PAGE}|g" .next/static/chunks/**/*.js

exec "$@"
