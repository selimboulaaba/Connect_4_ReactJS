import axios from "axios"
import auth from "./auth"

const url = import.meta.env.VITE_API_URL + "/users"

export const signup = async (body) => {
    return await axios.post(url + "/signup", body)
}

export const signin = async (body) => {
    return await axios.post(url + "/signin", body)
}

export const getUser = async () => {
    return await axios.get(url, { headers: auth.header() })
}

export const getUserByUsername = async (username) => {
    return await axios.get(url + "/" + username, { headers: auth.header() })
}

export const addFriend = async (id) => {
    return await axios.post(url + "/addFriend", { friendId: id }, { headers: auth.header() })
}
