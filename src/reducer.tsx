import { SET_AJAX_ERROR, SET_AJAX_LOADING, SET_AJAX_RESPONSE } from './actions'

const initialState = {}

export default (state:any = initialState, action: any) => {
  switch (action.type) {
    case SET_AJAX_LOADING:
      return {
        ...state,
        [action.payload]: {
          loading: true,
          response: null,
          error: null
        }
      }
    case SET_AJAX_RESPONSE:
      return {
        ...state,
        [action.payload.id]: {
          loading: false,
          response: action.payload.response,
          error: null
        }
      }
    case SET_AJAX_ERROR:
      return {
        ...state,
        [action.payload.id]: {
          loading: false,
          response: null,
          error: action.payload.error
        }
      }
    default:
      return state
  }
}

