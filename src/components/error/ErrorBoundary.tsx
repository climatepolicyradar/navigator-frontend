import React from "react";
import Button from "@components/buttons/Button";

// based on: https://nextjs.org/docs/advanced-features/error-handling

type TState = {
  hasError: boolean;
};
type TProps = {
  children: React.ReactNode;
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
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="max-w-screen-sm m-auto h-full flex flex-col justify-center p-4">
          <h2>Sorry, the app has encountered an error and needs to restart</h2>
          <p className="my-4">Please click the button below to start the app.</p>
          <div>
            <Button extraClasses="bg-black text-white hover:border-black hover:bg-black" thin onClick={() => this.setState({ hasError: false })}>
              Restart
            </Button>
          </div>
          <p className="my-4">To report a problem email us at support@climatepolicyradar.org</p>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
