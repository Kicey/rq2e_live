### Where this example fits

This is **example 7 of 9 in Chapter 5's teaching sequence**. It is the controlled repair for [`rq05-bad-todo`](#/chapter/5/rq05-bad-todo). The component structure, initial strings, keys, and delete buttons remain almost identical so the update strategy is the change to study.

### Start from React's current array

The broken version mutates the closed-over `todos` array and sends the same reference back. This version passes an updater to `setTodos`:

```jsx
setTodos((value) => [
  ...value.slice(0, index),
  ...value.slice(index + 1),
]);
```

React supplies its current stored array as `value`. Calculating from that argument avoids basing the next list on a possibly stale binding captured by the event handler.

### Build a replacement without changing the old array

The selected `index` divides the current array into two parts:

- `value.slice(0, index)` contains every item before the selected task;
- `value.slice(index + 1)` contains every item after it.

`slice` does not mutate `value`. Spreading both segments into a new array joins them while omitting exactly one item. React receives a different array reference and renders the two remaining tasks.

The important rule is broader than avoiding `splice`: treat the current state as read-only and construct the complete next state. A nonmutating method could still be used incorrectly if its result were discarded, while a newly allocated wrapper after mutation would not undo corruption of the old value.

### Compare the feedback paths

In the broken example, mutation changes hidden contents but the same reference interrupts the expected state-to-display path. Here, the new array is both the intended data and a new observable state value. React can store it, rerender, and map over the replacement.

### Try an equivalent immutable operation

Replace the slice/spread updater with:

```jsx
setTodos((value) => value.filter((_, itemIndex) => itemIndex !== index));
```

The expected behavior is unchanged: clicking the second `x` removes `Water the dishes`, leaves the first and third tasks, and produces a new array without modifying `value`.

Both versions are valid. Slice/spread emphasizes the two retained segments; `filter` expresses the rule “keep every position except this one.” Restore the book version after comparing them.

### Check your mental model

Why is “do not call `splice`” an incomplete explanation?

Because React needs a correct next value, and the old state must remain unmodified. The reliable rule is immutable replacement, not a blacklist of one array method.

### Continue the sequence

Open [`rq05-filter-todo`](#/chapter/5/rq05-filter-todo) to keep tasks instead of deleting them, immutably update one object, add a separate filter state, and derive the visible list.

*Book context: printed pages 168–169; original PDF positions 194–195. Figures 5.29–5.30 and Listing 5.7; compare Listing 5.6.*
