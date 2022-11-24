#! /usr/bin/env bash
# This file tests the netlify function for sending emails

# Check if the port is already used or not
is_using=$(lsof -i:9999 | awk -F '  ' '{ print $1 }')
if [ -z "$is_using" ]; then
	echo "Starting a server on port 9999";
	netlify functions:serve  --port 9999 &
elif ! [[ "$is_using" =~ .*"node".* ]]; then
	echo "$is_using"
	echo "The port 9999 is already used and not by us :-("
	exit 1;
else
	echo "The server is running."
fi


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

send_emails () {
	res=$(netlify functions:invoke --port 9999 send-emails --payload "$(cat $1)")
	echo "$res"
	# status=$(echo "$res" | head -n 1 | cut -d ','  -f 1 | cut -d ':' -f 2)
	status=$(echo "$res" | jq '.["status"]')
	if [ "$status" != '"200"' ]; then
		echo "Issue with $1";
		exit 2
	fi
}
	
send_emails $SCRIPT_DIR/invite-en.json  && \
send_emails $SCRIPT_DIR/invite-fr.json && \
send_emails $SCRIPT_DIR/admin-en.json && \
send_emails $SCRIPT_DIR/admin-fr.json
