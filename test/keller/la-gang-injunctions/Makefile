# patterns matching css files that should be minified
# files with a -min.css suffix will be ignored

CSS_FINAL = css/project-name-all.css
CSS_FILES = $(filter-out %-min.css,$(wildcard \
	css/*.css \
))

# patterns matching js files that should be minified
# files with a -min.js suffix will be ignored
JS_FILES = $(filter-out %-min.js,$(wildcard \
	scripts/*.js \
	scripts/**/*.js \
))

# command to run to execute the yui compressor
YUI_COMPRESSOR = java -jar /usr/local/Cellar/yuicompressor/2.4.8/libexec/yuicompressor-2.4.8.jar

# flags to pass to the yui compressor for both css and js
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose

CSS_MINIFIED = $(CSS_FILES:.css=-min.css)
JS_MINIFIED = $(JS_FILES:.js=-min.js)

# target: minify - minifies css and js
minify: minify-css minify-js

# target: minify-css - minifies css
minify-css: $(CSS_FILES) $(CSS_MINIFIED)
	cat $^ >$@
	rm -f $(CSS_MINIFIED)

# target: minify-js - minifies js
minify-js: $(JS_FILES) $(JS_MINIFIED)

%-min.css: %.css
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type css $< >$@
	@echo

%-min.js: %.js
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type js $< >$@
	@echo

# target: clean - removes minified css and js files
clean:
	rm -f $(CSS_MINIFIED) $(JS_MINIFIED)

# target: help - displays help
help:
	@egrep "^# target:" Makefile