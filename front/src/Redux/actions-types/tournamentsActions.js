import { IS_IN_TOURNAMENT, LEFT_TOURNAMENT } from '../actions/index';

export const setIsInTournament = (isInTournament) => {
    return {
        type: IS_IN_TOURNAMENT,
        payload: isInTournament
    }
}

export const setLeftTournament = () => {
    return {
        type: LEFT_TOURNAMENT,
    }
}