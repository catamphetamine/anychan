# Run Git garbage collector.
git reflog expire --expire=now --all && git gc --prune=now --aggressive
# Display repository size.
git count-objects -vH