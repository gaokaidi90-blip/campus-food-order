import { post } from '@/utils/request'

/**
 * 上传图片
 * @param formData 包含文件的 FormData 对象
 * @param type 上传类型：avatar（默认）
 */
export function uploadImage(formData: FormData, type: 'avatar' = 'avatar') {
  return post<{ url: string }>(`/upload/${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
