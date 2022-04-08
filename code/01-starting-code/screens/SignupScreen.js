import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import AuthContent from '../components/Auth/AuthContent';
import { AuthContext } from '../store/auth-context';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';

function SignupScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authCTX = useContext(AuthContext);

    async function signupHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const token = await createUser(
                'signInWithPassword',
                email,
                password
            );
            authCTX.authenticate(token);
        } catch (error) {
            Alert.alert('Registration Error', 'Please try again');
        }

        setIsAuthenticating(false);
    }
    if (isAuthenticating) {
        return <LoadingOverlay message='Creating User...' />;
    }
    return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
