import axios from "axios";
import { Navigate } from "react-router-dom";

const Logout = () => {
    // accessing backend
    axios.post("logout")

    return <Navigate to={'/'} state={{nav_msg: "Logged out."}}/>
};

export default Logout;
