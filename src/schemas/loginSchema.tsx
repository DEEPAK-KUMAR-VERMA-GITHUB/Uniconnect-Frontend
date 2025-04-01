import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      'Invalid email address',
    )
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must contains atleast 8 characters')
    .required('Required'),
});
