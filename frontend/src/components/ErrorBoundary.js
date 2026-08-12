import React from "react";
class ErrorBoundary extends React.Component {
    constructor(props){
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render(){
        if(this.state.hasError){
            return (
                <div className="error-boundary">
                <h2>Something went wrong.</h2>
                <p>This part of the page hit an error. You can try reloading it below.</p>
                <button onClick={this.handleReset}>Try again</button>
                </div>
            );
        }
        return this.props.children
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

}
export default ErrorBoundary;