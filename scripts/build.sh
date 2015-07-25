#!/bin/bash -e

webpack=node_modules/.bin/webpack
build_dir=build

rm -rf $build_dir

NODE_ENV=production $webpack index.js $build_dir/NuclearJSReactAddons.js
NODE_ENV=production $webpack -p index.js $build_dir/NuclearJSReactAddons.min.js
