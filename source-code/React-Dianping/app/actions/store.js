import * as actionTypes from '../constants/store'

export function update(data){
	return {
		type:actionTypes.STORE_UPDATE,
		data
	}
}

export function add(item){
	return {
		type:actionTypes.STORE_ADD,
		data:item
	}
}

export function rm(item){
	return {
		type:actionTypes.STORE_RM,
		data:item
	}
}