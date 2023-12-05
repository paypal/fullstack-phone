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
# echo "Compiling client code with Closure Compiler Service..."
# curl \
#   -v \
#   --location \
#   --header 'Content-Type: application/x-www-form-urlencoded' \
#   --data output_format=text \
#   --data output_info=compiled_code \
#   --data output_info=errors \
#   --data warning_level=VERBOSE \
#   --data use_closure_library=true \
#   --data compilation_level=ADVANCED_OPTIMIZATIONS \
#   --data-urlencode js_code@src/phoneAdapter.js \
#   --data-urlencode js_code@src/injectMeta.js \
#   --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/asyoutypeformatter.js \
#   --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/phonenumberutil.js \
#   --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/phonemetadata.pb.js \
#   --data-urlencode js_code@vendor/libphonenumber/javascript/i18n/phonenumbers/phonenumber.pb.js \
#   --output client/index.js \
#   https://closure-compiler.appspot.com/compile

# Use local compiler
# https://www.npmjs.com/package/google-closure-compiler
# https://github.com/google/closure-compiler/wiki/Flags-and-Options
echo "Compiling with Google Closure Compiler..."
npx google-closure-compiler --version
npx google-closure-compiler \
  --isolation_mode=IIFE \
  --assume_function_wrapper \
  --compilation_level=ADVANCED \
  --warning_level=DEFAULT \
  --js_output_file=client/index.js \
  --js=src/phoneAdapter.js \
  --js=src/injectMeta.js \
  --js=vendor/libphonenumber/javascript/i18n/phonenumbers/asyoutypeformatter.js \
  --js=vendor/libphonenumber/javascript/i18n/phonenumbers/phonenumberutil.js \
  --js=vendor/libphonenumber/javascript/i18n/phonenumbers/phonemetadata.pb.js \
  --js=vendor/libphonenumber/javascript/i18n/phonenumbers/phonenumber.pb.js \
  --js=node_modules/google-closure-library/closure/goog/array/array.js \
  --js=node_modules/google-closure-library/closure/goog/asserts/asserts.js \
  --js=node_modules/google-closure-library/closure/goog/base.js \
  --js=node_modules/google-closure-library/closure/goog/debug/error.js \
  --js=node_modules/google-closure-library/closure/goog/dom/asserts.js \
  --js=node_modules/google-closure-library/closure/goog/dom/htmlelement.js \
  --js=node_modules/google-closure-library/closure/goog/dom/nodetype.js \
  --js=node_modules/google-closure-library/closure/goog/dom/safe.js \
  --js=node_modules/google-closure-library/closure/goog/asserts/dom.js \
  --js=node_modules/google-closure-library/closure/goog/dom/element.js \
  --js=node_modules/google-closure-library/closure/goog/dom/tagname.js \
  --js=node_modules/google-closure-library/closure/goog/dom/tags.js \
  --js=node_modules/google-closure-library/closure/goog/fs/blob.js \
  --js=node_modules/google-closure-library/closure/goog/fs/url.js \
  --js=node_modules/google-closure-library/closure/goog/functions/functions.js \
  --js=node_modules/google-closure-library/closure/goog/html/safehtml.js \
  --js=node_modules/google-closure-library/closure/goog/html/safescript.js \
  --js=node_modules/google-closure-library/closure/goog/html/safestyle.js \
  --js=node_modules/google-closure-library/closure/goog/html/safestylesheet.js \
  --js=node_modules/google-closure-library/closure/goog/html/safeurl.js \
  --js=node_modules/google-closure-library/closure/goog/html/trustedresourceurl.js \
  --js=node_modules/google-closure-library/closure/goog/html/trustedtypes.js \
  --js=node_modules/google-closure-library/closure/goog/html/uncheckedconversions.js \
  --js=node_modules/google-closure-library/closure/goog/i18n/bidi.js \
  --js=node_modules/google-closure-library/closure/goog/labs/useragent/browser.js \
  --js=node_modules/google-closure-library/closure/goog/labs/useragent/useragent.js \
  --js=node_modules/google-closure-library/closure/goog/flags/flags.js \
  --js=node_modules/google-closure-library/closure/goog/labs/useragent/highentropy/highentropyvalue.js \
  --js=node_modules/google-closure-library/closure/goog/labs/useragent/highentropy/highentropydata.js \
  --js=node_modules/google-closure-library/closure/goog/labs/useragent/util.js \
  --js=node_modules/google-closure-library/closure/goog/object/object.js \
  --js=node_modules/google-closure-library/closure/goog/proto2/descriptor.js \
  --js=node_modules/google-closure-library/closure/goog/proto2/fielddescriptor.js \
  --js=node_modules/google-closure-library/closure/goog/proto2/lazydeserializer.js \
  --js=node_modules/google-closure-library/closure/goog/proto2/message.js \
  --js=node_modules/google-closure-library/closure/goog/proto2/pbliteserializer.js \
  --js=node_modules/google-closure-library/closure/goog/proto2/serializer.js \
  --js=node_modules/google-closure-library/closure/goog/string/const.js \
  --js=node_modules/google-closure-library/closure/goog/string/internal.js \
  --js=node_modules/google-closure-library/closure/goog/string/string.js \
  --js=node_modules/google-closure-library/closure/goog/string/stringbuffer.js \
  --js=node_modules/google-closure-library/closure/goog/string/typedstring.js

# Replace global this modification with module.exports
echo "Patching client code to support CJS module.exports..."
grep '}).call(this);$' client/index.js >/dev/null || echo "WARNING: Failed to apply CJS support. Please check bin/build.sh"
sed -i.bk 's/}).call(this);$/}).call(module.exports);/' client/index.js
rm client/index.js.bk

echo "Done."
