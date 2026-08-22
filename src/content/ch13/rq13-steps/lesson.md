### Context as an application boundary

The example places the task collection and every operation that can change it inside `TaskProvider`. Components such as `TaskList`, `StepCheckbox`, and `StepAdd` do not pass that data through several layers of props. Instead, the custom `useTask` hook gives each component access to the shared context exactly where it is needed.

### Following an update through React

Start with the form in `StepAdd`. Submitting it calls the provider's `addStep` action with a task identifier and the new label. That action passes an updater function to `setTasks`, producing a new task array and a new steps array for the matching task. React then publishes the updated context value and renders the consumers that use it.

### Updating nested state without mutation

The provider uses `map`, `filter`, `concat`, object spread, and array slices rather than changing existing objects in place. These operations preserve referential changes that React can observe while keeping unrelated tasks untouched. Compare `editStep`, `deleteStep`, and `addStep` to see three common immutable update patterns side by side.

### Keeping components focused

Each component owns a narrow responsibility. `TaskProgress` derives completion from the current steps, `TaskHeader` controls expansion and title editing, and `StepCheckbox` toggles one value. The provider owns the data rules; the components own presentation and user interaction. This separation makes the application easier to extend and test.

### Synchronizing with an external system

A `useEffect` watches the task array and serializes it after changes. The lazy initializer passed to `useState` restores saved data only during the initial render. Together, those two pieces demonstrate how React state can synchronize with browser storage without making storage the source of truth for every render.

### Try it in the editor

Expand the task, add a step, and mark it complete while watching the percentage and progress bar. Then open `fixture.js` and change the initial task, or adjust `TaskProgress.js` to display a different derived value. Press **Run** to rebuild the complete module graph from your edited files.
