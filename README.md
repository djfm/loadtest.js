# loadtest.js

This is a very simple script that takes a URL and a number of parallel connections and attempts to load the given URL in parallel using phantomjs to collect basic metrics.

It reports the average OK time of successful requests, the number of failed requests and the number of parallel requests reached.

Example:
```bash
./multiload.js http://www.example.com 10
Ran 10 queries (10 parallel), average OK time 205 (failures: 0)
```
