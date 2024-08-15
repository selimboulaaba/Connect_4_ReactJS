import axios from "axios"
import auth from "./auth"

const url = import.meta.env.VITE_API_URL + "/games"

export const createGame = async (id) => {
    return await axios.post(url, { p1: id }, { headers: auth.header() })
}

export const getGame = async (id) => {
    return await axios.get(url + "/" + id, { headers: auth.header() })
}

export const joinGame = async (id) => {
    return await axios.put(url + "/" + id, null, { headers: auth.header() })
}

export const updateMove = async (id, body) => {
    return await axios.put(url + "/move/" + id, body, { headers: auth.header() })
}
