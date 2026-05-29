import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status);

    useEffect(() => {
        const isProtectedRoute = authentication;
        const isGuestOnlyRoute = !authentication;
        const isUserAuthenticated = authStatus;

        if (isProtectedRoute && !isUserAuthenticated) {
            navigate("/login");
        } else if (isGuestOnlyRoute && isUserAuthenticated) {
            navigate("/");
        }

        setLoader(false);
    }, [authStatus, navigate, authentication]);

    return loader ? <h1>Loading...</h1> : <>{children}</>;
}
