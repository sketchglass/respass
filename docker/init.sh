#!/bin/bash
set -e

npm install -g typings
typings install
npm install
npm run db:migrate
