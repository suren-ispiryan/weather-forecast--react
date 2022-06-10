import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="collapse navbar-collapse container">
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <span className="sr-only">
                        <Link to="/" className="nav-link text-light">
                            | Forecast
                        </Link>
                    </span>
                </li>
                <li className="nav-item active">
                    <span className="sr-only">
                        <Link to="/favorite" className="nav-link text-light">
                            | Favourites
                        </Link>
                    </span>
                </li>
                <li className="nav-item active">
                    <span className="sr-only">
                        <Link to="/5/days" className="nav-link text-light">
                            | Show weather for 5 days
                        </Link>
                    </span>
                </li>
            </ul>
        </div>
    </nav>
)

export default Navbar;
