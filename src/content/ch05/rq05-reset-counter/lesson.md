### Where this example fits

This is **example 5 of 9 in Chapter 5's teaching sequence**. It places the two ordinary setter forms beside each other, then shows why calling a setter is not the same as guaranteeing a committed UI update.

### Compare the two next-state decisions

Increment calculates from the previous count:

```jsx
setCounter((val) => val + 1)
```

Reset already knows the desired value:

```jsx
setCounter(0)
```

This is the same distinction introduced by [`rq05-accordion`](#/chapter/5/rq05-accordion): fixed outcomes use direct values; calculations from prior state use updater functions.

### Follow effective and unchanged resets

Consider three actions:

1. Increment from 0 requests 1. The state changes and the display becomes `Counter: 1`.
2. Reset from 1 requests 0. The state changes and the display becomes `Counter: 0`.
3. Reset again requests 0 while 0 is already current. React compares the requested value with stored state and can bail out without committing another UI update.

For this number, the equality decision is straightforward. The next example, [`rq05-bad-todo`](#/chapter/5/rq05-bad-todo), shows why the same rule becomes dangerous when an array is mutated but retains its reference.

### Observe commits carefully

The book uses React Developer Tools' render highlighting: an effective update highlights the component, while an unchanged reset does not produce the same committed update. Extension layout and labels can vary by installed version.

Avoid treating `console.count` inside the component as definitive commit evidence. All repository entries use development `StrictMode`, which can call component functions while checking work that React later discards. The visible output and a commit-aware profiler answer a different question from raw function-call logs.

### Try a different fixed reset target

Change the Reset handler temporarily:

```jsx
<button onClick={() => setCounter(5)}>Reset to 5</button>
```

The expected sequence is:

- initial display: 0;
- Increment: 1;
- Reset to 5: 5;
- Increment: 6;
- Reset to 5: 5.

Repeated Reset to 5 clicks leave the visible value at 5 because every click requests the same fixed outcome. Restore the original zero reset after the experiment.

### Check your mental model

If Reset is clicked while the counter is already zero, did the event handler run?

Yes. The handler requests a state value. React can then determine that the requested number equals the stored number and avoid a redundant committed update. Event handling, setter processing, component-function calls, and DOM commits are related stages, not interchangeable terms.

*Book context: printed pages 162–165; original PDF positions 188–191. Figures 5.23–5.26 and Listing 5.5.*
