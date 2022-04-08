import axios from 'axios';

const API_KEY = 'AIzaSyBAQLQgkVBlJ8XN3GnULmBJWY0C124ubeE';

export async function createUser(email, password) {
    const response = await axios.post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            API_KEY,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        }
    );
}
