import { Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./styles.css";

/** A failure of the interface is shown in words, never as a blank page: the channel may be absent. */
class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }
  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("interface failure", error, info.componentStack);
  }
  override render(): ReactNode {
    if (this.state.error) {
      return (
        <main className="start">
          <h1>IPE</h1>
          <p className="error" data-testid="interface-error">
            {this.state.error.message}
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}

const host = document.getElementById("root");
if (host) createRoot(host).render(<Boundary><App /></Boundary>);
