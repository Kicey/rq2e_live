### Where this example fits

This is **example 2 of 9 in Chapter 5's teaching sequence**. It keeps the state cycle from [`rq05-functional-counter`](#/chapter/5/rq05-functional-counter), then asks two new questions: can a prop choose the initial value, and do several uses of one component share the same state?

### One definition creates three stateful instances

`Counter` now accepts a `start` prop:

```jsx
function Counter({ start }) {
  const [counter, setCounter] = useState(start);
```

`App` renders that component three times with `0`, `123`, and `-64`. There is one `Counter` function definition, but React mounts three component instances. Each call to `useState(start)` belongs to its own mounted instance.

Click only the Increment button beside `123`. That counter becomes `124`; the counters displaying `0` and `-64` do not change. They use the same component code and updater, but they do not share the stored value.

### A prop seeds state; it does not synchronize it

For a newly mounted `Counter`, the current `start` prop supplies the initial state. On later renders, React evaluates the component function again, but it preserves the instance's existing `counter` value. A new `start` prop does not replace that stored state automatically.

This distinction prevents two sources from silently fighting each other. After initialization, `counter` is owned by `Counter` and changes through `setCounter`. If the desired design were to display the current prop directly, local state would be unnecessary. Synchronizing state in response to later prop changes is a separate problem; Chapter 6 introduces effects, but this example does not need one.

### Try changing the prop after mount

Temporarily replace `App` with this version:

```jsx
function App() {
  const [firstStart, setFirstStart] = useState(0);
  return (
    <>
      <button onClick={() => setFirstStart(10)}>Change first start to 10</button>
      <Counter start={firstStart} />
      <Counter start={123} />
      <Counter start={-64} />
    </>
  );
}
```

After the preview rebuilds, increment the first counter once so it displays `1`. Then click **Change first start to 10**. The expected result is that the parent prop becomes 10, but the mounted child's display remains `1`. The other two counters remain independent at 123 and -64.

The result would differ if the child were removed and mounted again: a new instance would use the then-current prop as its initial seed.

Restore the original `App` after the experiment.

### Check your mental model

Why does `useState(start)` not make `counter` mirror `start`?

Because the argument initializes state for that mounted instance. Afterward, React returns the stored state value. The prop and state can change independently unless the component implements an explicit synchronization rule.

### Continue the sequence

Open [`rq05-accordion`](#/chapter/5/rq05-accordion) to replace numeric state with a local Boolean and compare fixed next values. [`rq05-calculator`](#/chapter/5/rq05-calculator) later handles the special case where the desired initial state is itself a function.

*Book context: printed pages 148–152; original PDF positions 174–178. Figures 5.10–5.12 and Listing 5.2.*
