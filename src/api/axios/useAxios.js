import axios from "axios";
import { getToken, selectUser, setCredentials } from "api/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { store } from "api/redux/store";

const baseURL = "https://localhost:7140/api";

const useAxios = () => {
    const dispatch = useDispatch();
    let { token, refreshToken, expiration } = useSelector(selectUser);

    const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` },
    });

    axiosInstance.interceptors.request.use(async (req) => {
        const isTokenExpired = Date.now() > Date.parse(expiration);

        if (!isTokenExpired) {
            return req;
        }

        const response = await axios.post(
            `${baseURL}/Authenticate/refresh-token/`,
            {
                accessToken: token,
                refreshToken: refreshToken,
            }
        );

        dispatch(getToken(response));
        req.headers.Authorization = `Bearer ${response.data.token}`;
        return req;
    });

    return axiosInstance;
};

export { baseURL };
export default useAxios;
