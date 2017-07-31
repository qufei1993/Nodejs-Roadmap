import { get } from '../get';

// 获取商户信息 
export function getInfoData(id) { 
	const result = get('/api/detail/info/' + id) 
	return result 
} 
// 获取评论数据 
export function getCommentData(page, id) { 
	const result = get('/api/detail/comment/' + page + '/' + id) 
	return result 
}
