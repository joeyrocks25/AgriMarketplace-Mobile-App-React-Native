import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = async (authToken) => {
    console.log("Auth token:", authToken);
    const decodedToken = jwtDecode(authToken);
    setUser({ ...decodedToken, token: authToken }); // Include the token property in the user object
    await authStorage.storeToken(authToken);
  };

  const logOut = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return { user, logIn, logOut };
};

export default useAuth;
