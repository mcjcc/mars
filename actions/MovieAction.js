import axios from 'axios';

export const FETCH_MOVIE1 = 'FETCH_MOVIE1';
export const FETCH_MOVIE2 = 'FETCH_MOVIE2';
export const FETCH_PROFILE = 'FETCH_PROFILE';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const LOGOUT = 'LOGOUT';

export function fetchMovie1(id) {
  const request = axios.get(`/movie/${id}`);

  return {
    type: FETCH_MOVIE1,
    payload: request,
  };
}

export function fetchMovie2(id) {
  const request = axios.get(`/movie/${id}`);

  return {
    type: FETCH_MOVIE2,
    payload: request,
  };
}

export function fetchProfile(username, password) {
  const request = axios.get(`/profile/${username}/${password}`);

  return {
    type: FETCH_PROFILE,
    payload: request,
  };
}

export function createProfile(username, password) {
  const request = axios.post(`/profile`, {username, password});

  return {
    type: CREATE_PROFILE,
    payload: request,
  }
}

export function logout() {
  return {
    type: LOGOUT,
  }
}
