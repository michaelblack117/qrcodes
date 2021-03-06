export const GENERATE = 'GENERATE';
export function generate(url, idType, prefix, length, suffix, quantity, tagType) {
  return {
    type: GENERATE,
    url: url,
    idType: idType,
    prefix: prefix,
    length: length,
    suffix: suffix,
    quantity: quantity,
    tagType: tagType
  }
}

export const CREATE_FIXED = 'CREATE_FIXED';
export function create(url, idType, fixedId, quantity, tagType) {
  return {
    type: CREATE_FIXED,
    url: url,
    idType: idType,
    fixedId: fixedId,
    quantity: quantity,
    tagType: tagType
  }
}

export const STORE_FULL_URL = 'STORE_FULL_URL';
export function storeFullURL(url) {
  return {
    type: STORE_FULL_URL,
    url: url
  }
}

export const RESET_URL_LIST = 'RESET_URL_LIST';
export function resetURLList() {
  return { type: RESET_URL_LIST }
}

export const DOWNLOADING = 'DOWNLOADING';
export function download() {
  return {
    type: DOWNLOADING
  }
}

export const DOWNLOADED = 'DOWNLOADED';
export function downloadComplete() {
  return {
    type: DOWNLOADED
  }
}
