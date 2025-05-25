import * as yup from 'yup';

export const assignmentUploadSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subjectId: yup.string().required('Subject is required'),
  file: yup.object().required('File is required'),
  dueDate: yup
    .string()
    .required('Due date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
});
