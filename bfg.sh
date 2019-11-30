# Run Git garbage collector.
git gc
# Display repository size.
git count-objects -vH
# Run BFG repo cleaner.
# `--massive-non-file-objects-sized-up-to 25M` is for preventing `org.eclipse.jgit.errors.LargeObjectException`.
# https://github.com/rtyley/bfg-repo-cleaner/issues/97
java -jar ../bfg-1.13.0.jar --strip-blobs-bigger-than 128K --protect-blobs-from master,gh-pages --massive-non-file-objects-sized-up-to 25M