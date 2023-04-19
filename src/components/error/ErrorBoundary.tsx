import React from "react";
import Button from "@components/buttons/Button";
import TopLevel from "./TopLevel";

// based on: https://nextjs.org/docs/advanced-features/error-handling

type TState = {
  hasError: boolean;
};
type TProps = {
  children: React.ReactNode;
  level: "top" | "page" | "component";
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
  // compnentDidCatch(error, errorInfo) {
  //   console.log({ error, errorInfo });
  // }

  handleClick = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <TopLevel resetError={this.handleClick} />;
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
