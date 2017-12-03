export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

// action creators
export function openModal() {
  return {
    type: OPEN_MODAL,
    value: true
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL,
    value: false
  }
}
