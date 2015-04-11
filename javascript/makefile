CFLAGS := --language_in ECMASCRIPT6 --language_out ECMASCRIPT5 --formatting=pretty_print

ALLJS := $(filter-out %.min.js, $(wildcard *.js))
ALLTARGETS := $(patsubst %.js, %.min.js, $(ALLJS))

all: satgame.min.js

satgame.min.js: $(ALLTARGETS)
	closure --formatting=pretty_print --js_output_file $@ $^

%.min.js: %.js
	closure $(CFLAGS) --js_output_file $@ $<
