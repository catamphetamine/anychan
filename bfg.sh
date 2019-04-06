# Run Git garbage collector.
git gc
# Display repository size.
git count-objects -vH
# Run BFG repo cleaner.
java -jar ../bfg-1.13.0.jar --strip-blobs-bigger-than 128K --protect-blobs-from master,gh-pages