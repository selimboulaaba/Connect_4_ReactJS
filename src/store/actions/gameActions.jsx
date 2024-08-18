export const ADD_GAME = 'ADD_GAME';
export const NEXT_GAME = 'NEXT_GAME';
export const UPDATE_MOVES = 'UPDATE_MOVES';
export const UPDATE_WINNER = 'UPDATE_WINNER';

export const setGame = (game) => {
    return {
        type: ADD_GAME,
        payload: game,
    };
};

export const nextGame = () => {
    return {
        type: NEXT_GAME,
    };
};

export const updateMoves = (target, value) => {
    return {
        type: UPDATE_MOVES,
        payload: { target, value },
    };
};

export const updateWinner = (target, value, winner) => {
    return {
        type: UPDATE_WINNER,
        payload: { target, value, winner },
    };
};

