# command to run to execute the yui compressor
YUI_COMPRESSOR = java -jar /usr/local/Cellar/yuicompressor/2.4.8/libexec/yuicompressor-2.4.8.jar

# flags to pass to the yui compressor for both css and js
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose

# patterns matching css files that should be minified
# files with a -min.css suffix will be ignored
CSS_FINAL = public/all.css
CSS_FILES = $(filter-out %-min.css,$(wildcard \
	css/*.css \
))

CSS_MINIFIED = $(CSS_FILES:.css=-min.css)

# patterns matching js files that should be minified
# files with a -min.js suffix will be ignored
JS_FINAL = public/all.js
JS_FILES = $(filter-out %-min.js,$(wildcard \
	scripts/*.js \
	scripts/**/*.js \
))

JS_MINIFIED = $(JS_FILES:.js=-min.js)

all: $(CSS_FINAL) $(JS_FINAL)

# CSS
$(CSS_FINAL): $(CSS_MINIFIED)
	cat $^ >$@
	rm -f $(CSS_MINIFIED)

%-min.css: %.css
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type css $< >$@
	@echo

# JS
$(JS_FINAL): $(JS_MINIFIED)
	cat $^ >$@
	rm -f $(JS_MINIFIED)

%-min.js: %.js
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type js $< >$@
	@echo

# target: clean - removes minified css and js files
clean:
	rm -f $(CSS_MINIFIED)
	rm -f $(CSS_FINAL)
	rm -f $(JS_MINIFIED)
	rm -f $(JS_FINAL)

# target: help - displays help
help:
	@egrep "^# target:" Makefile