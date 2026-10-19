import { createSlice } from '@reduxjs/toolkit'
import { getToken } from '../lib/api'

const storeToken = (token) => {
  try {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  } catch { /* storage unavailable (private mode) */ }
}

const token = getToken()

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token,
    // 'loading' while we restore a saved session, so guards don't flash the sign-in page.
    status: token ? 'loading' : 'ready',
  },
  reducers: {
    signedIn(state, { payload }) {
      storeToken(payload.token)
      state.token = payload.token
      state.user = payload.user
      state.status = 'ready'
    },
    userLoaded(state, { payload }) {
      state.user = payload
      state.status = 'ready'
    },
    profilePatched(state, { payload }) {
      if (state.user) Object.assign(state.user, payload)
    },
    signedOut(state) {
      storeToken(null)
      state.token = null
      state.user = null
      state.status = 'ready'
    },
  },
})

export const { signedIn, userLoaded, profilePatched, signedOut } = userSlice.actions
export default userSlice.reducer

export const selectUser = (s) => s.user.user
export const selectSignedIn = (s) => !!s.user.token
