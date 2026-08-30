### Where this example fits

This is **example 1 of 9 in Chapter 5's teaching sequence**. It introduces the complete functional-state cycle. Later examples change how state is initialized, what it stores, and how updates are requested, but they all build on the four operations visible here.

### Why this counter needs state

A component can calculate JSX from its properties, but a click counter also has to remember something that changes between renders. An ordinary local variable is not enough: it is recreated when the component function runs, and assigning to it does not tell React to render again.

`Counter` therefore owns one state value. No sibling or parent uses the count, so keeping it inside `Counter` gives the value the narrowest useful scope.

### Follow the state cycle in `App.js`

The example contains four state operations:

1. `import { useState } from "react"` makes the hook available.
2. `useState(0)` creates state for this mounted `Counter`. Array destructuring names the current value `counter` and its setter `setCounter`.
3. `<p>Counter: {counter}</p>` reads the current value while React renders the component.
4. The button calls `setCounter((value) => value + 1)`. React supplies the latest stored value to the updater, stores its result, and renders the component with the new value.

The updater does not modify `counter` directly. It describes the next value from the previous one. The visible loop is:

```text
click → request previous value + 1 → React stores it → Counter renders → JSX reads it
```

The setter is the boundary that matters. Calculating `value + 1` produces a number; calling `setCounter` tells React that the number should become state.

### Keep hooks in a stable order

`useState` is called directly in `Counter`, before the returned JSX. Keep hooks at the top level of a component: not inside a condition, loop, callback, or event handler, and not after an early return that may run on some renders.

React associates hook state with call order. If one render calls a hook and another skips it, React can no longer match stored values to the correct calls. The book demonstrates that rule with separate visible-counter snippets; those snippets are context for this file, not missing repository code.

### State can hold many kinds of values

This example stores a number, but React does not impose a number-only type after `useState(0)`. Later examples store a Boolean, a function, and arrays of objects. JavaScript would even allow this counter to replace `0` with a string, as the book demonstrates.

Runtime permission is not the same as a coherent model. A value named `counter` should continue behaving like a count unless the component deliberately changes its contract. Choose the state shape from the information and update rules the component needs.

### Try a different starting point and step

Before editing, predict the first three displayed values. Then make these two changes:

```jsx
const [counter, setCounter] = useState(10);
```

```jsx
setCounter((value) => value + 2)
```

Press **Run** if the preview does not rebuild automatically, then click Increment twice. The expected sequence is `10 → 12 → 14`. The starting value is used when this `Counter` mounts; each click calculates from the latest stored value.

Restore `0` and `+ 1` when you finish so later comparisons use the book's baseline.

### Check your mental model

Suppose `counter` were an ordinary variable and the click handler assigned a larger number to it. The calculation could succeed inside JavaScript, but React would not receive a state update, and the next component call would not recover that local variable as remembered state.

The important distinction is not “variable versus constant.” It is **ordinary JavaScript storage versus state owned and scheduled by React**.

### Book and repository note

Listing 5.1 labels the displayed value `Clicks:`. This repository uses `Counter:`, and the book's result screenshot in Figure 5.7 also uses `Counter:`. The label differs; the state behavior is the same.

### Optional: the same cycle in a class component

The end of Chapter 5 maps this counter to class-component state. The conceptual cycle remains initialize, read, update, and render, but the container and update rules differ:

- functional state exposes a local value/setter pair; a class reads fields from one `this.state` object;
- `useState` replaces its stored value, while class `setState` shallowly merges the supplied object fields;
- a functional update can bail out when the requested value is unchanged, while the book contrasts class `setState` as scheduling a render even when its field values are unchanged.

The book provides a partial class counter and a comparison table, not a checked-in class-counter application or a step-by-step conversion. Treat the comparison as maintenance context rather than another runnable example.

### Continue the sequence

Open [`rq05-triple-counter`](#/chapter/5/rq05-triple-counter) for prop-seeded, instance-local state. Use [`rq05-accordion`](#/chapter/5/rq05-accordion) and [`rq05-reset-counter`](#/chapter/5/rq05-reset-counter) to compare fixed next values with prior-state updaters.

*Book context: printed pages 136–145, 146–148, 154–157, and 176–181; original PDF positions 162–171, 172–174, 180–183, and 202–207. Figures 5.1, 5.5–5.9, 5.17–5.18, and 5.35; Listing 5.1; Table 5.1.*
