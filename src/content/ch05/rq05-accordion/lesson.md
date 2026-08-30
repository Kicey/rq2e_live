### Where this example fits

This is **example 3 of 9 in Chapter 5's teaching sequence**. The counter examples calculate each new number from the previous number. This accordion shows the other ordinary setter form: requesting a fixed next value.

### Model a local interface choice

`isExpanded` records a transient presentation choice used only by `Accordion`:

```jsx
const [isExpanded, setExpanded] = useState(false);
```

`false` means the secret paragraph is absent. The conditional expression renders that paragraph only when the state becomes true:

```jsx
{isExpanded && (
  <p>
    Password: <code>hunter2</code>.
  </p>
)}
```

No parent or sibling needs this value, so local ownership is appropriate.

### Use direct values when the outcome is already known

The minus button always means “collapsed,” regardless of the current state:

```jsx
setExpanded(false)
```

The plus button always means “expanded”:

```jsx
setExpanded(true)
```

Neither handler needs to inspect the previous value. Passing an updater function would add machinery without changing the decision.

Repeated clicks are idempotent: plus followed by plus still requests true, and minus followed by minus still requests false. [`rq05-reset-counter`](#/chapter/5/rq05-reset-counter) examines the render-bailout implication of requesting an already-current value.

### Try a true toggle

Replace the two minus/plus buttons with one button:

```jsx
<button onClick={() => setExpanded((value) => !value)}>Toggle</button>
```

The expected sequence is collapsed → expanded → collapsed as you click repeatedly. A toggle differs from separate Open and Close actions because its next value depends on the previous one, so the updater form is appropriate.

Restore the two original buttons after the experiment. Their direct setters communicate the intended fixed outcomes more clearly.

### Check your mental model

Does every setter called from an event handler need an updater function?

No. The choice depends on how the next state is obtained. Use an updater when calculating from prior state; pass a value directly when the next value is already known.

### Continue the sequence

Open [`rq05-calculator`](#/chapter/5/rq05-calculator) for a different kind of state value: a function that React must store rather than invoke. Then compare both setter forms side by side in [`rq05-reset-counter`](#/chapter/5/rq05-reset-counter).

*Book context: printed pages 158–160; original PDF positions 184–186. Figures 5.19–5.20 and Listing 5.3.*
