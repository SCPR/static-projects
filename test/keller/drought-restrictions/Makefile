PHONY: css js

cssfiles = 'css/style.css' 'css/test.css'
jsfiles = 'scripts/app.js' 'scripts/data.js'

css: $(cssfiles)
	@yuicompressor public/all.css -o public/all.css
	@echo Built all.css

js: $(jsfiles)
	@yuicompressor public/all.js -o public/all.js
	@echo Built all.js

$(cssfiles):
	@cat $@ >> public/all.css

$(jsfiles):
	@cat $@ >> public/all.js

all: css js

watch:
	@echo Watching for changes...
	@fswatch css:js "echo changed && make clean && make"

clean:
	@rm -f public/all.css public/all.js version