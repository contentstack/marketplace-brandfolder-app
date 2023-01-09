import React from "react";
import { TrackJS } from "trackjs";

interface MyProps {}

interface MyState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // error tracker for error reporting service
    TrackJS.track(error);
    // Update state so the next render will show the fallback UI.
    console.warn(error); // Remove this line if not required.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // error tracker for error reporting service
    TrackJS.track(error);
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.error("errorInfo ", errorInfo);
    throw new Error(errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props || {};
    if (hasError) {
      // error tracker for error reporting service
      TrackJS.track(this.state.hasError);
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return children;
  }
}

export default ErrorBoundary;
