import { post } from '@/utils/request'

/**
 * 上传图片
 * @param formData 包含文件的 FormData 对象
 * @param type 上传类型：avatar | dish | canteen
 */
export function uploadImage(formData: FormData, type: 'avatar' | 'dish' | 'canteen' = 'dish') {
  // Let Axios/browser add the multipart boundary automatically.
  return post<{ url: string }>(`/upload/${type}`, formData)
}
