const LoadingSpinner = () => {
    return (
        <div className="loading">
            <div className="spinner-grow text-primary" role="status" />
            <div className="spinner-grow text-secondary" role="status" />
            <div className="spinner-grow text-success" role="status" />
            <div className="spinner-grow text-danger" role="status" />
            <div className="spinner-grow text-warning" role="status" />
            <div className="spinner-grow text-info" role="status" />
            <div className="spinner-grow text-light" role="status" />
            <div className="spinner-grow text-dark" role="status" />
            <span className="sr-only mx-4">Loading...</span>
        </div>
    );
}

export default LoadingSpinner;
