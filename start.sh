#!/bin/bash

tmux new-session -d -s calos \
	'templ generate --watch --proxy=http://localhost:8080 --proxyport=3000 -path ./src/templates --open-browser=false -v' \; \
	split-window -v 'tailwindcss -i ./src/static/input.css -o ./src/static/styles.css --watch' \; \
	split-window -h 'air' \; \
	select-layout tiled \; \
	attach
