#!/bin/bash -e
babel=node_modules/.bin/babel
build_dir=build

rm -rf $build_dir

NODE_ENV=production $babel src --out-dir $build_dir

webpack=node_modules/.bin/webpack
dist_dir=dist

rm -rf $dist_dir

NODE_ENV=production $webpack src/index.js $dist_dir/NuclearJSReactAddons.js
NODE_ENV=production $webpack -p src/index.js $dist_dir/NuclearJSReactAddons.min.js
