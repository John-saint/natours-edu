import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Sign up successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 3500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
