### Where this example fits

This is **example 6 of 9 in Chapter 5's teaching sequence**. [`rq05-reset-counter`](#/chapter/5/rq05-reset-counter) showed that React can skip a render when a number is unchanged. This example applies the same equality rule to an array and deliberately gets the update wrong. The unchanged screen is the behavior to investigate.

### Reproduce the failure first

The preview starts with three tasks, each followed by an `x` button. Click the first `x`. `Feed the plants` remains visible. Try another button and the screen still does not change.

The click handler did run. The defect is the pair of operations inside it:

```jsx
todos.splice(index, 1);
setTodos(todos);
```

### What `splice` changes

`splice` removes an item from the existing array. It does not create a replacement array. After the first line, the object referenced by `todos` has different contents, but its identity is unchanged.

There is a second alias to keep in mind. `useState(initialList)` initially stores the same array object that arrived through the `initialList` prop. Mutating `todos` therefore also mutates that original array object. State and input data no longer have a clean boundary.

### Why the setter does not repair the mutation

`setTodos(todos)` passes the same reference back to React. For state equality, an array is compared by identity rather than by inspecting every element. The previous state reference and the requested state reference are the same, so `Object.is(previousTodos, requestedTodos)` would be `true`.

React therefore has no new state value that requires the expected display update. The data object has been mutated behind React's back while the DOM still shows the previous render. A setter call is not proof that a different value was supplied.

This explains an otherwise confusing debugging result: logging the array after `splice` can show fewer items even though the browser still shows all three tasks. The data and rendered output have diverged.

### Try an identity-only diagnostic

Keep `splice` temporarily, but change the following line:

```jsx
setTodos([...todos]);
```

The spread expression creates a new array containing the already-mutated items. Click an `x`; the visible task now disappears because React receives a different reference.

This is a diagnostic, **not the final repair**. The old state and the prop-owned array were still mutated first. It proves that reference identity controls whether React can observe this replacement, but it does not make the update safe.

Restore `setTodos(todos)` after the experiment so this example remains intentionally broken.

### Check your mental model

Which statement is false?

1. The click handler executes.
2. The array's contents change.
3. `setTodos` receives a new array.
4. The browser can remain visually unchanged.

Statement 3 is false. The first line changes the existing array, and the second line sends that same array back.

### Compare the actual repair

Open [`rq05-proper-todo`](#/chapter/5/rq05-proper-todo) next. It keeps the component, initial items, and visible UI almost identical so one change stands out: its updater constructs a new array from the items before and after the selected index. It neither mutates the current state nor returns the same reference.

Later, [`rq05-filter-todo`](#/chapter/5/rq05-filter-todo) applies the same rule at two levels: it creates a new task array and a copied task object for the item whose `done` field changes.

*Book context: printed pages 166–167; original PDF positions 192–193. Figures 5.27–5.28 and Listing 5.6. Compare printed pages 168–169, Figures 5.29–5.30, and Listing 5.7 for the immutable repair.*
