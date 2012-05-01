TESTS = test/*.js
REPORTER = dot
BENCHMARKS = benchmark/*.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: lib-cov
	@SEEDRIAK_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov

bench:
	@NODE_ENV=benchmark ./node_modules/.bin/matcha \
		$(BENCHMARKS)

.PHONY: test test-cov lib-cov benchmark
