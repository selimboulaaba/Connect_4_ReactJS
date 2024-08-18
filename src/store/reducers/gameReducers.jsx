import { ADD_GAME, NEXT_GAME, UPDATE_MOVES, UPDATE_WINNER } from '../actions/gameActions';

const initialState = {
    game: {
        _id: null,
        p1: {},
        p2: null,
        p1_Moves: [],
        p2_Moves: [],
        score: { p1: 0, p2: 0 }
    },
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
                        [winner]: state.game.score[winner] + 1,
                    }
                },
            };
        default:
            return state;
    }
};

export default gameReducer;
