import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { RefreshIcon } from "./icons";

function statusLabel(status: string) {
  if (status === "initial") return "Compiling";
  if (status === "running") return "Live";
  if (status === "timeout") return "Timed out";
  if (status === "idle") return "Ready";
  return status || "Ready";
}

export function PreviewPane() {
  const { sandpack } = useSandpack();
  const running = sandpack.status === "initial";

  return (
    <section className="panel preview-panel" aria-labelledby="previewHeading">
      <div className="panel-toolbar preview-toolbar">
        <div>
          <span className="panel-kicker">Output</span>
          <h1 id="previewHeading">Live preview</h1>
        </div>
        <div className="preview-actions">
          <span className={`run-status ${running ? "running" : ""}`}>
            <span className="status-dot" />{statusLabel(sandpack.status)}
          </span>
          <button className="icon-button" type="button" aria-label="Refresh preview" title="Refresh preview" onClick={() => sandpack.runSandpack()}>
            <RefreshIcon />
          </button>
        </div>
      </div>

      <div className="preview-stage">
        <div className="browser-frame">
          <div className="browser-bar" aria-hidden="true">
            <span className="browser-dots"><i /><i /><i /></span>
            <span className="address-bar">localhost / task-manager</span>
            <span className="browser-menu">•••</span>
          </div>
          <SandpackPreview
            className="sandpack-preview"
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />
        </div>
        <p className="preview-hint"><kbd>Ctrl</kbd><span>+</span><kbd>Enter</kbd> to run your changes</p>
      </div>
    </section>
  );
}
