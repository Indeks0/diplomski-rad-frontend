import { selectUser } from "api/redux/authSlice";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const HomePage = () => {
    const user = useSelector(selectUser);
    return <Outlet />;
};
export default HomePage;
