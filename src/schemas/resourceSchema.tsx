// Uniconnect/src/schemas/resourceSchema.ts
import * as yup from 'yup';

export const resourceUploadSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  subject: yup.string().required('Subject is required'),
  file: yup.object().required('File is required'),
  type: yup.string().required('Resource type is required'),
  year: yup.string().when('type', {
    is: 'pyq',
    then: () => yup.string().required('Year is required for PYQs'),
  }),
});
