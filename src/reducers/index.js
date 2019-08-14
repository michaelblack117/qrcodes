import { GENERATE, CREATE_FIXED, DOWNLOADING, DOWNLOADED } from '../actions';

export const initialState = {
  url: "",
  idType: "",
  prefix: "",
  length: 4,
  suffix: "",
  quantity: 0,
  tagType: "",
  fixedId: "",
  downloading: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GENERATE:
      return Object.assign({}, state, {
        url: action.url,
        idType: action.idType,
        prefix: action.prefix,
        length: action.length,
        suffix: action.suffix,
        quantity: action.quantity,
        tagType: action.tagType
      })
    case CREATE_FIXED:
      return Object.assign({}, state, {
        url: action.url,
        idType: action.idType,
        fixedId: action.fixedId,
        quantity: action.quantity,
        tagType: action.tagType
      })
    case DOWNLOADING:
      return Object.assign({}, state, {
        downloading: true
      })
    case DOWNLOADED:
      return Object.assign({}, state, {
        downloading: false
      })
    default:
      return state;
  }
}
