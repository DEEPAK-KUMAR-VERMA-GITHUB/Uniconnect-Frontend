import * as Yup from 'yup';

export const studentRegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(4, 'Full Name must be at least 4 characters')
    .required('Full Name is required'),
  email: Yup.string()
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      'Invalid email address',
    )
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase, one lowercase, one number and one special character',
    )
    .required('Password is required'),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be exactly 10 digits')
    .required('Mobile Number is required'),
  rollNumber: Yup.string()
    .min(2, 'Roll Number must be at least 2 characters')
    .required('Roll Number is required'),
  course: Yup.string().required('Course is required'),
  session: Yup.string()
    .min(2, 'Session must be at least 2 characters')
    .required('Session is required'),
  semester: Yup.string()
    .min(2, 'Semester must be at least 2 characters')
    .required('Semester is required'),
});

export const facultyRegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(4, 'Full Name must be at least 4 characters')
    .required('Full Name is required'),
  email: Yup.string()
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      'Invalid email address',
    )
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase, one lowercase, one number and one special character',
    )
    .required('Password is required'),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be exactly 10 digits')
    .required('Mobile Number is required'),
  facultyId: Yup.string()
    .min(2, 'Faculty ID must be at least 2 characters')
    .required('Faculty ID is required'),
  department: Yup.string().required('Department is required'),
  session: Yup.string()
    .min(2, 'Session must be at least 2 characters')
    .required('Session is required'),
  designation: Yup.string().required('Designation is required'),
  semester: Yup.string()
    .min(2, 'Semester must be at least 2 characters')
    .required('Semester is required'),
  course: Yup.array().min(1, 'At least one course is required'),
});
