import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export const AuthGuard = () => {
    const token = useSelector(state => state.user.token);
    const location = useLocation();

    return (
        (token)
            ? <Outlet />
            : <Navigate to="/signin" state={{ from: location }} replace />
    );
}

export default AuthGuard;