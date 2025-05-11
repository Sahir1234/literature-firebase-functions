
import { ClientData } from "../model/ClientData";
import { GameData } from "../model/GameData";
import { GameActionResult } from "../model/GameActionResult";

export const createGameFunction = (clientData: ClientData, gameData: GameData | null): GameActionResult => {
    if (gameData) {
        return GameActionResult.FAILED_GAME_ID_IN_USE;
    }

    return GameActionResult.SUCCESS_CREATE_NEW_GAME;
}

export const joinGameFunction = (clientData: ClientData, gameData: GameData | null): GameActionResult => {
    if (gameData === null) {
      return GameActionResult.FAILED_GAME_ID_NOT_FOUND;
    }

    return gameData.addPlayer(clientData.getPlayerName(), clientData.getUid());
}
