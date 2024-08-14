import axios from "axios"

const url = import.meta.env.VITE_API_URL + "/users"

export const signup = async (body) => {
    return await axios.post(url + "/signup", body)
}

export const signin = async (body) => {
    return await axios.post(url + "/signin", body)
}

export const getUser = async (id) => {
    return await axios.get(url + "/" + id)
}