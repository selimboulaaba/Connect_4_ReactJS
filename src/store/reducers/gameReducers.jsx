import { ADD_GAME, NEXT_GAME, SET_WINNER, UPDATE_MOVES, UPDATE_WINNER, SET_REMATCH_PENDING, CLEAR_REMATCH_PENDING } from '../actions/gameActions';

const initialState = {
    game: {
        _id: null,
        p1: {},
        p2: null,
        p1_Moves: [],
        p2_Moves: [],
        score: { p1: 0, p2: 0 }
    },
    winner: null,
    rematchPending: false,
    rematchRequester: null,
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_GAME:
            return {
                ...state,
                game: action.payload,
            };
        case NEXT_GAME:
            return {
                ...state,
                game: {
                    ...state.game,
                    p1_Moves: [],
                    p2_Moves: [],
                },
                winner: null
            };
        case UPDATE_MOVES:
            return {
                ...state,
                game: {
                    ...state.game,
                    [action.payload.target]: action.payload.value,
                },
            };
        case UPDATE_WINNER:
            return {
                ...state,
                game: {
                    ...state.game,
                    [action.payload.target]: action.payload.value,
                    score: {
                        ...state.game.score,
                        [action.payload.winner]: state.game.score[action.payload.winner] + 1,
                    }
                },
            };
        case SET_WINNER:
            return {
                ...state,
                winner: action.payload
            };
        case SET_REMATCH_PENDING:
            return {
                ...state,
                rematchPending: true,
                rematchRequester: action.payload,
            };
        case CLEAR_REMATCH_PENDING:
            return {
                ...state,
                rematchPending: false,
                rematchRequester: null,
            };
        default:
            return state;
    }
};

export default gameReducer;
