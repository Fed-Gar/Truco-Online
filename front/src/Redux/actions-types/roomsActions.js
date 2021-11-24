import { IS_IN_ROOM } from '../actions/index';

export const setIsInRoom = (isInRoom) => {
    return {
        type: IS_IN_ROOM,
        payload: isInRoom
    }
}