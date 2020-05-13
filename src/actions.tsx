import {get} from 'fetch-factorized'

export const SET_AJAX_LOADING = 'SET_AJAX_LOADING'
export const SET_AJAX_RESPONSE = 'SET_AJAX_RESPONSE'
export const SET_AJAX_ERROR = 'SET_AJAX_ERROR'

export const fetchAjaxStoreData = (id:string, url:string) =>
  (dispatch:any) => {
    dispatch({type: SET_AJAX_LOADING, payload: id})
    return get(url)
      .then(json => dispatch({type: SET_AJAX_RESPONSE, payload: {id, response: json}}))
      .catch(error => dispatch({type: SET_AJAX_ERROR, payload: {id, error: error || 'Unknown error'}}))
  }
