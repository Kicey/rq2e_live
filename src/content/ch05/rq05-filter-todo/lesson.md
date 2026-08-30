### Where this example fits

This is **example 8 of 9 in Chapter 5's teaching sequence**. [`rq05-proper-todo`](#/chapter/5/rq05-proper-todo) established immutable array replacement. This version keeps completed tasks, adds an independent filter choice, and calculates one visible list from those source values.

### Expand each task's source data

Each initial item now carries three fields:

```jsx
{ task: "Feed the plants", done: false, index: 0 }
```

`task` is the label, `done` is changing application data, and `index` records the position in the unfiltered source array. Completed tasks remain in `todos`; they are marked rather than deleted.

### Replace both the array and the changed object

`markDone` maps over the current list:

```jsx
function markDone(list, index) {
  return list.map((item, i) => (i === index ? { ...item, done: true } : item));
}
```

`map` creates a new array. For the matching position, object spread creates a new task object with `done: true`; unrelated objects are retained. The event handler calls this utility through a prior-state updater, preserving the immutable rule from proper-todo at both array and object levels.

### Keep independent concerns in separate states

The application has two source values:

```jsx
const [todos, setTodos] = useState(initialList);
const [hideDone, setHideDone] = useState(false);
```

Task data and the current filter are independent concerns, so separate hooks keep their update paths explicit. Both hooks are unconditional and remain in the same order on every render.

Related fields can sometimes share one object—for example, the book groups a loader's `loaded` and `total` values—but an object is not automatically better. Group values when they form one update unit, not merely because a component has more than one value.

### Derive the visible list

`filteredTodos` is calculated rather than stored:

```jsx
const filteredTodos = hideDone ? todos.filter(({ done }) => !done) : todos;
```

It depends completely on `todos` and `hideDone`. Storing it in a third hook would create a duplicate source of truth that every task/filter update would have to synchronize.

Mark the first task done while Show All is active: it stays visible with strike-through. Click Hide Done: the task disappears from the view but remains completed in `todos`. Click Show All and it returns. Filtering changes the projection, not the source records.

### Understand the stored index

The callback uses `todo.index`, not the second `index` parameter supplied by `filteredTodos.map`. Once completed tasks are hidden, a visible item's filtered position may differ from its source position.

The stored numeric index works in this fixed example because source tasks are never inserted, deleted, or reordered. In a changing list, use a stable item identifier and locate/update by that identifier instead of persisting positions.

### Try another derived value

After `filteredTodos`, add:

```jsx
const remainingCount = todos.filter(({ done }) => !done).length;
```

Render it inside `main`, for example after the filter-button container:

```jsx
<p>Remaining: {remainingCount}</p>
```

The expected count starts at 3 and falls to 2 when one task is marked done. Switching between Show All and Hide Done leaves it at 2 because the count derives from source completion data, not from the current view. No third hook is needed.

### Check your mental model

Which values are sources and which are derived?

`todos` and `hideDone` are source state. `filteredTodos` and `remainingCount` are calculations from those sources. If either calculation becomes inconsistent, fix the calculation rather than synchronize another setter.

### Continue the sequence

Open [`rq05-nice-todo`](#/chapter/5/rq05-nice-todo) to preserve this state model while extracting `Task` and `FilterButton` children and passing values/actions through props.

*Book context: printed page 142, pages 157–158, and pages 169–172; original PDF positions 168, 183–184, and 195–198. Figures 5.31–5.32 and Listing 5.8.*
