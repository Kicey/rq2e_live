import type { PointerEvent as ReactPointerEvent } from "react";

type Orientation = "vertical" | "horizontal";

export function useResizablePanes(shellId: string) {
  const startResize = (orientation: Orientation) => (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 960) return;
    event.preventDefault();

    const handle = event.currentTarget;
    const shell = document.getElementById(shellId);
    if (!shell) return;

    const move = (pointerEvent: PointerEvent) => {
      const bounds = shell.getBoundingClientRect();
      if (orientation === "vertical") {
        const preview = shell.querySelector<HTMLElement>(".preview-panel");
        const previewLeft = preview?.getBoundingClientRect().left ?? bounds.left;
        const availableWidth = bounds.right - previewLeft;
        const width = Math.min(
          Math.max(pointerEvent.clientX - previewLeft, 360),
          availableWidth - 370,
        );
        document.documentElement.style.setProperty("--preview-width", `${width}px`);
      } else {
        const height = Math.min(Math.max(bounds.bottom - pointerEvent.clientY, 190), bounds.height - 305);
        document.documentElement.style.setProperty("--lesson-height", `${height}px`);
      }
    };

    const stop = () => {
      handle.classList.remove("dragging");
      document.body.classList.remove("is-resizing");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    handle.classList.add("dragging");
    document.body.classList.add("is-resizing");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  return { startResize };
}
