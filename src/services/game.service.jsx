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

export const inviteFriend = async (p1, p2) => {
    return await axios.post(url + "/invite", { p1, p2 }, { headers: auth.header() })
}

export const requestRematch = async (id) => {
    return await axios.post(url + "/rematch/" + id, {}, { headers: auth.header() })
}

export const getHistory = async () => {
    return await axios.get(url + "/history", { headers: auth.header() })
}

export const getActiveGames = async () => {
    return await axios.get(url + "/active", { headers: auth.header() })
}

const api = import.meta.env.VITE_API_URL

export const getTodayPuzzle = async () => {
    const token = localStorage.getItem('token')
    return await axios.get(api + "/puzzles/today", { headers: token ? auth.header() : {} })
}

export const solvePuzzle = async (move) => {
    return await axios.post(api + "/puzzles/today/solve", { move }, { headers: auth.header() })
}

export const createTournament = async (body) => {
    return await axios.post(api + "/tournaments", body, { headers: auth.header() })
}

export const getTournament = async (id) => {
    return await axios.get(api + "/tournaments/" + id, { headers: auth.header() })
}

export const joinTournament = async (id) => {
    return await axios.put(api + "/tournaments/" + id + "/join", {}, { headers: auth.header() })
}

export const startTournament = async (id) => {
    return await axios.put(api + "/tournaments/" + id + "/start", {}, { headers: auth.header() })
}

