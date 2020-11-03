#!/usr/bin/env bash

# Clean files
echo "Removing generated files..."
rm -f client/index.js
rm -rf server/metadata
mkdir server/metadata

# Extract regional metadata
echo "Extracting regional metadata..."
util/metadataExtractor.js vendor/libphonenumber/javascript/i18n/phonenumbers/metadata.js server/metadata/

# Send source to Closure Compiler Service API for compilation
# cf. https://developers.google.com/closure/compiler/docs/api-ref
echo "Compiling client code with Closure Compiler Service..."
curl -v \
  --data output_format=text \
  --data output_info=compiled_code \
  --data output_info=errors \
  --data warning_level=VERBOSE \
  --data use_closure_library=true \
  --data compilation_level=ADVANCED_OPTIMIZATIONS \
  --data-urlencode js_code@src/phoneAdapter.js \
  --data-urlencode js_code@src/injectMeta.js \
  --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/asyoutypeformatter.js \
  --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/phonenumberutil.js \
  --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/phonemetadata.pb.js \
  --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/phonenumber.pb.js \
  --output client/index.js \
  https://closure-compiler.appspot.com/compile

# Add support for Node.js
echo "Patching client code to expand global scope support..."
grep '^var aa=this' client/index.js >/dev/null || echo "WARNING: Failed to apply Node.js support, please check bin/build.sh"
sed -ie \
  's/^var aa=this||self/var aa;if(void 0!==this)aa=this;else if("undefined"!=typeof global)aa=global;else{if("undefined"==typeof self)throw new Error("Can'"'"'t find global scope");aa=self}/g' \
  client/index.js

echo "Done."
