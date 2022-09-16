import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "api/redux/authSlice";

const RequireAuth = () => {
    const user = useSelector(selectUser);
    const location = useLocation();

    //dodati roles

    return user.token ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};
export default RequireAuth;
