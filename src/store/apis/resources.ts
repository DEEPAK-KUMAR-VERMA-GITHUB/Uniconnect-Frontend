import {useMutation, useQuery} from '@tanstack/react-query';
import {api} from './api';
import {queryClient} from './queryClient';

export type Resource = {
  _id: string;
  title: string;
  fileUrl: string;
  type: 'note' | 'pyq';
  year?: string;
  uploadedBy: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

const uploadResource = async ({
  file,
  title,
  subjectId,
  type,
  year,
}: {
  file: any;
  title: string;
  subjectId: string;
  type: string;
  year?: string;
}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('type', type);
  if (year) {
    formData.append('year', year);
  }

  const response = await api.post(
    `/subjects/${subjectId}/add-resource`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

const getRources = async (
  subjectId?: string,
  type?: string,
  facultyId?: string,
) => {
  if (!subjectId) return [];

  let response;
  if (facultyId) {
    response = await api.get(
      `/subjects/${subjectId}/resources?facultyId=${facultyId}`,
    );
  } else {
    response = await api.get(`/subjects/${subjectId}/resources`);
  }
  return response.data.data.resources.filter(
    (resource: any) => resource.type === type,
  );
};

const deleteResource = async (subjectId: string, resourceId: string) => {
  const response = await api.delete(
    `/subjects/${subjectId}/remove-resource/${resourceId}`,
  );
  return response.data;
};

export const useUploadResource = () => {
  return useMutation({
    mutationFn: uploadResource,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.type === 'note' ? 'notes' : 'pyqs'],
      });
    },
  });
};

export const useGetResource = (
  subjectId?: string,
  type?: 'note' | 'pyq',
  facultyId?: string,
) => {
  return useQuery({
    queryKey: ['resources', subjectId, type, facultyId],
    queryFn: () => getRources(subjectId, type, facultyId),
    enabled: !!subjectId,
  });
};

export const useDeleteResource = () => {
  return useMutation({
    mutationFn: ({
      subjectId,
      resourceId,
    }: {
      subjectId: string;
      resourceId: string;
    }) => deleteResource(subjectId, resourceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['resources', variables.subjectId],
      });
    },
  });
};
