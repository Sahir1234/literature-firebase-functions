import { ClientData } from "../model/ClientData";
import { GameActionResult } from "../model/GameActionResult";
import { GameData } from "../model/GameData";

export const leaveLobbyFunction = (clientData: ClientData, gameData: GameData | null): GameActionResult => {
    return gameData!.removePlayer(clientData.getPlayerName(), clientData.getUid());
}

export const switchTeamsFunction = (clientData: ClientData, gameData: GameData | null): GameActionResult => {
    return gameData!.switchPlayerTeam(clientData.getPlayerName());
}

export const startGameFunction = (clientData: ClientData, gameData: GameData | null): GameActionResult => {
    return gameData!.beginGame();
}
