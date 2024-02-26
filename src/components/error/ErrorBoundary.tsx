/* eslint-disable no-console */
import React from "react";
import TopLevel from "./TopLevel";
import PageLevel from "./PageLevel";

// based on: https://nextjs.org/docs/advanced-features/error-handling

type TState = {
  hasError: boolean;
};
type TProps = {
  children: React.ReactNode;
  level: "top" | "page";
};

class ErrorBoundary extends React.Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  // Track using error logging service
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn({ error, errorInfo });
  }

  handleClick = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.level === "page") return <PageLevel resetError={this.handleClick} />;
      return <TopLevel resetError={this.handleClick} />;
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
