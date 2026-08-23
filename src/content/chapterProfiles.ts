interface ChapterProfile {
  title: string;
  heading: string;
  summary: string;
  concepts: string;
  experiment: string;
}

export const chapterProfiles: Record<number, ChapterProfile> = {
  1: { title: "React foundations", heading: "Rendering a first React element", summary: "See the smallest complete path from an HTML host node to content managed by React.", concepts: "the React element description, the DOM container, and the root that connects the two", experiment: "Change the element type, its text, and its props, then identify which values describe React output and which values belong to the surrounding page." },
  2: { title: "Components and JSX", heading: "Composing UI with components", summary: "Build small component trees while examining props, children, nesting, siblings, and fragments.", concepts: "component boundaries, JSX nesting, props, children, and the shape of the element tree", experiment: "Move one piece of markup into a component, pass it through props or children, and compare the resulting DOM structure in the preview." },
  3: { title: "Working with JSX", heading: "Expressing interface details in JSX", summary: "Explore how JSX handles expressions, whitespace, lists, attributes, form controls, and children.", concepts: "JavaScript expressions inside markup, DOM property conventions, whitespace, and rendering collections", experiment: "Change one JSX expression or attribute at a time and use the preview to distinguish JavaScript behavior from HTML rendering behavior." },
  4: { title: "Component patterns", heading: "Designing reusable components", summary: "Compare class and function components while refining defaults, destructuring, rest props, and composition.", concepts: "public component APIs, prop handling, class and function syntax, and incremental refactoring", experiment: "Compare neighboring versions of the example and reproduce one refactoring yourself without changing the rendered result." },
  5: { title: "State and events", heading: "Turning components into interactive UI", summary: "Connect user events to state updates and derive rendered output from the latest state.", concepts: "state ownership, event handlers, immutable updates, derived values, and functional state setters", experiment: "Trigger several updates in one interaction, then compare direct state replacement with an updater function that receives the previous value." },
  6: { title: "Effects and lifecycle", heading: "Synchronizing React with the outside world", summary: "Use effects for timers, document state, remote data, and browser resources that live outside rendering.", concepts: "effect dependencies, setup and cleanup, browser APIs, asynchronous work, and stale closures", experiment: "Change an effect dependency or temporarily remove its cleanup and observe when synchronization runs and what resource is left behind." },
  7: { title: "Reusable stateful logic", heading: "Extracting behavior without extracting state", summary: "Follow related state and update behavior as it is shared and coordinated across components.", concepts: "state reuse, update ordering, component identity, and the boundary between shared logic and shared data", experiment: "Duplicate or relocate a stateful component and observe whether its values remain independent or become coordinated." },
  8: { title: "The hooks toolbox", heading: "Choosing hooks for browser-facing behavior", summary: "Apply refs, memoization, persistence, transitions, and custom hooks to realistic interface behavior.", concepts: "refs, memoized calculations, deferred updates, persistent values, and reusable browser subscriptions", experiment: "Identify which changes should cause rendering, which should persist without rendering, and which can be deferred without changing correctness." },
  9: { title: "Forms and controlled input", heading: "Modeling user input as application state", summary: "Build controlled and uncontrolled fields, validation rules, composed forms, and reusable input APIs.", concepts: "controlled values, change events, validation, field composition, and form-level state ownership", experiment: "Trace one keystroke from the browser event through state and back into the input value, then add a small validation or formatting rule." },
  10: { title: "State architecture", heading: "Scaling updates with reducers and context", summary: "Compare prop passing, context, and reducers as application state reaches more consumers and gains more operations.", concepts: "reducer actions, immutable state transitions, provider boundaries, dispatch, and data loading", experiment: "Add one new action and follow it from the initiating control through the reducer to every component that consumes the updated state." },
  11: { title: "Shared component configuration", heading: "Coordinating a component family", summary: "Evolve navigation components from fixed markup toward reusable, contextual, and data-driven behavior.", concepts: "static and dynamic configuration, shared context, component composition, and focused public APIs", experiment: "Add or reorder a menu item and determine which version localizes the change most effectively without coupling consumers to implementation details." },
  12: { title: "Custom hooks", heading: "Packaging timer behavior into reusable hooks", summary: "Build timer controls in stages while extracting reusable state, effects, and commands.", concepts: "custom hook contracts, interval cleanup, initialization, reset behavior, and multiple independent hook instances", experiment: "Create a second timer or change its initial value, then confirm that setup, pause, restart, and cleanup remain independent." },
  13: { title: "Task manager", heading: "Growing a complete React application", summary: "Assemble component composition, context, reducers, immutable collections, forms, and drag interactions in one application.", concepts: "feature boundaries, shared task state, reducer operations, nested collections, and interaction state", experiment: "Start with one user action and follow its data through the component tree, update function, and rerendered task list before extending it." },
};

export function buildLesson(chapter: number, title: string, visibleFiles: string[]): string {
  const profile = chapterProfiles[chapter];
  const fileList = visibleFiles.slice(0, 4).map((file) => `\`${file}\``).join(", ");
  const remaining = Math.max(visibleFiles.length - 4, 0);
  const fileDescription = remaining > 0
    ? `${fileList}, and ${remaining} more source ${remaining === 1 ? "file" : "files"}`
    : fileList;

  return `### What this section isolates

**${title}** gives one focused snapshot of ${profile.concepts}. The example is deliberately small enough that you can connect each component definition to the DOM it produces, while the editor and preview keep that relationship visible as the code changes.

### Reading the implementation

Begin at the entry file and follow imports toward the component that owns the behavior named by this section. The editable project contains ${fileDescription}. Look for where data is created, which values cross a component boundary, and which event or effect causes the next render. That path is more important than reading every file from top to bottom.

### A useful experiment

${profile.experiment} Run after each meaningful change so that syntax errors or behavioral differences stay tied to one decision. If the result surprises you, reset the active file and repeat the change in a smaller step.

### Connect it to the chapter

This section is one stage in **${profile.title}**. Compare it with the neighboring examples in the chapter menu: repeated files reveal the stable structure, while the changed files show the new idea being introduced. That comparison turns a finished example into a sequence of design decisions.`;
}
