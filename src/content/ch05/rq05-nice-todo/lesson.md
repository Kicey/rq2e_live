### Where this example fits

This is **example 9 of 9 in Chapter 5's teaching sequence**. It keeps the state model and behavior from [`rq05-filter-todo`](#/chapter/5/rq05-filter-todo), then divides presentation among `TodoApplication`, `FilterButton`, and `Task`. The new question is not how filtering works; it is who owns the state and how children receive permission to change it.

### Find the state owner

Only `TodoApplication` calls `useState`:

```jsx
const [todos, setTodos] = useState(initialList);
const [hideDone, setHideDone] = useState(false);
```

It also derives `filteredTodos` from those two source values. `Task` and `FilterButton` receive props but create no state of their own, so they are stateless even though their buttons can cause the interface to change.

This ownership is appropriately narrow. Every current consumer is inside `TodoApplication`. If a new sibling outside that subtree also needed the tasks or filter, the state would have to move to a common ancestor such as `App` or to another shared mechanism.

### Values travel down to focused children

Each `Task` receives the data needed to render one row:

- `task` supplies the label;
- `done` selects the color, marker, and whether the button is active;
- `markDone` supplies one allowed action.

The two `FilterButton` instances receive the current filter, their own target `flag`, the `setHideDone` setter under the prop name `setFilter`, and their label as `children`. The component uses `current === flag` to style the selected option.

Passing these values as props keeps the children reusable and makes their dependencies visible at the call site.

### Actions travel down as function values

The children do not send state upward. The owner creates functions and passes them downward, just like any other prop.

Follow a task completion from click to render:

1. The user clicks a hollow-circle button in `Task`.
2. `Task` calls its `markDone` prop.
3. That prop is the closure created in `TodoApplication` for this task's original index.
4. The closure calls `setTodos` with a prior-state updater.
5. The `markDone(list, index)` utility returns a new array and a copied object for the matching task.
6. React stores the new array and renders `TodoApplication` again; `filteredTodos` and the child props are recalculated.

`Task` initiates the update, but `TodoApplication` still owns both the old and new state.

The filter path uses a broader child API. `FilterButton` receives the raw setter plus a target flag, then decides when to call `setFilter(flag)`. The task path is narrower: each `Task` receives a callback that already knows exactly which task it may complete. Both styles are valid; the narrower callback reveals less of the parent's state API.

### Presentation changed; the data model did not

The selected filter gets a dark background. Completed tasks turn gray and display `✓`; unfinished tasks display `◯`. Those symbols and styles make state visible, but they do not add another source of truth. Completion still lives in each task's `done` field, and filtering is still derived rather than stored.

The repository's `✓` and `◯` expressions are part of Listing 5.9. They matter here because they are the visual projection of `done`, not decorative state kept somewhere else.

### Try a narrower filter-button API

Refactor `FilterButton` so the parent computes selection and supplies one action:

```jsx
function FilterButton({ selected, onSelect, children }) {
  const style = {
    border: "1px solid dimgray",
    background: selected ? "dimgray" : "transparent",
    color: selected ? "white" : "dimgray",
    padding: "4px 10px",
  };
  return (
    <button style={style} onClick={onSelect}>
      {children}
    </button>
  );
}
```

Update the two call sites accordingly:

```jsx
<FilterButton selected={!hideDone} onSelect={() => setHideDone(false)}>
  Show all
</FilterButton>
<FilterButton selected={hideDone} onSelect={() => setHideDone(true)}>
  Hide done
</FilterButton>
```

The expected behavior and styling are unchanged. The tradeoff is API placement: `TodoApplication` now computes both the selected state and exact action, while `FilterButton` knows only how to display and invoke them.

### Check your mental model

`Task` calls a function that eventually updates `todos`. Why is `Task` still stateless?

Because ownership depends on where the state is created and retained. `Task` receives a current value and a callback through props. It does not call `useState`, retain the task list, or decide how the list is replaced.

### Continue beyond this chapter

For this small tree, explicit props make the data flow easy to inspect. As consumers spread across deeper or more distant branches, Chapter 10's Context, reducers, and custom hooks provide other ways to organize the same ownership responsibilities. They do not remove the need to decide which component or provider owns each source value.

The optional functional/class state comparison is attached to [`rq05-functional-counter`](#/chapter/5/rq05-functional-counter), the repository that directly matches the book's class-counter discussion. Chapter 5 does not include a class version of this to-do application.

*Book context: printed pages 138–142 and 172–176; original PDF positions 164–168 and 198–202. Figures 5.2–5.4 and 5.32–5.34; Listing 5.9.*
