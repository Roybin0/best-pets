import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

export const useRedirect = (userAuthStatus) => {
    const history = useHistory();

    useEffect(() => {
        const handleMount = async () => {
            try {
                await axios.post('dj-rest-auth/token/refresh/')
                if (userAuthStatus === 'loggedIn') {
                    history.goBack();
                }
            } catch(err) {
                // console.log(err)
                if (userAuthStatus === 'loggedOut') {
                    history.push('/signin')
                }
            }
        };

        handleMount();
    }, [history, userAuthStatus]);
};  