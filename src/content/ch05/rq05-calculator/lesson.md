### Where this example fits

This is **example 4 of 9 in Chapter 5's teaching sequence**. [`rq05-triple-counter`](#/chapter/5/rq05-triple-counter) initialized state from ordinary values, and [`rq05-accordion`](#/chapter/5/rq05-accordion) set ordinary Boolean values directly. This calculator handles an ambiguity: the value React should store is itself a function.

### Treat the selected operator as data

`PLUS`, `MINUS`, and `MULTIPLY` are callable values. The interface selects one, stores it as `operator`, and invokes the selected function while rendering:

```jsx
<code> {operator(a, b)}</code>
```

With operands 7 and 4, the initial `PLUS` operator produces 11. Clicking Minus produces 3, and Multiply produces 28.

### Why initialization needs an outer function

When `useState` receives a function, React treats it as initializer logic and calls it to obtain the initial state. Passing `PLUS` directly would ask React to call `PLUS` as an initializer. That is not the desired operation.

The wrapper separates the two roles:

```jsx
const [operator, setOperator] = useState(() => PLUS);
```

React invokes the outer arrow. That arrow returns `PLUS`, so the operator function itself becomes the stored value.

The same syntax supports ordinary lazy initialization. The book's password example passes a function so an expensive value is calculated only when initial state is needed. Here, however, the returned value is also a function. The extra layer is what distinguishes initialization logic from callable data.

### Why every operator update also needs a wrapper

A setter also interprets a function argument as updater logic. Therefore each button returns the desired function from an outer arrow:

```jsx
setOperator(() => MINUS)
```

React calls the outer updater and stores `MINUS`; later rendering calls `MINUS(7, 4)` normally. The outer arrow is not the operator that remains in state.

### Try removing one wrapper

Change only the Minus handler to this deliberately incorrect form:

```jsx
<button onClick={() => setOperator(MINUS)}>Minus</button>
```

The calculator initially still shows 11. When you click Minus, React invokes `MINUS` as an updater with the previous operator as its one argument. Its second operand is missing, so the result is not a callable operator. The expected result on the next render is an **operator is not a function** error rather than 3 from `operator(a, b)`.

Restore `setOperator(() => MINUS)` to recover the preview. The failure demonstrates why the wrapper is required at update time, not merely at initialization.

### Development logging caveat

Every repository entry wraps `App` in `StrictMode`. A development build may call initializer logic more than once to detect impurities while keeping one result. Initializers and updater functions must therefore be pure; raw log counts are not a reliable model of committed UI updates.

### Check your mental model

What value is stored after `setOperator(() => MULTIPLY)`?

`MULTIPLY` is stored. React calls the outer arrow as updater logic, and that arrow returns the function intended as data.

### Continue the sequence

Open [`rq05-reset-counter`](#/chapter/5/rq05-reset-counter) to return to ordinary numeric state and examine what happens when a direct setter requests a value that is already current.

*Book context: printed pages 152–154 and 160–162; original PDF positions 178–180 and 186–188. Figures 5.13–5.16 and 5.21–5.22; Listing 5.4.*
