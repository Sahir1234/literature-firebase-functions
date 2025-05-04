import * as functions from "firebase-functions";
import { db } from "../utils/firebaseAdmin";
import { ClientData, isValidClientDataPresent } from "../data/clientData";
import {
  MISSING_CLIENT_SIDE_DATA,
  SUCCESS_SWITCHED_TEAMS,
  ERROR_SWITCHING_TEAMS,
  GAME_HAS_ALREADY_STARTED,
  PLAYER_NO_LONGER_IN_GAME
} from "../utils/alertMessages";
import { failedResponse, successfulResponse } from "../utils/backendResponse";
import { isGameInLobby, isPlayerInGame, switchPlayerTeams } from "../data/gameData";

export const switchTeams = functions.https.onCall(
  async (request: any, context) => {
    const { gameId, playerName, uid } = request.data as ClientData;

    try {
      if (!isValidClientDataPresent({ gameId, playerName, uid })) {
        return failedResponse(MISSING_CLIENT_SIDE_DATA);
      }

      const gameRef = db.ref(`GAMES/${gameId}`);
      const snapshot = await gameRef.once("value");

      let gameData = snapshot.val();

      if (!isGameInLobby(gameData)) {
        return failedResponse(GAME_HAS_ALREADY_STARTED);
      }

      if (!isPlayerInGame(gameData, playerName, uid)) {
        return failedResponse(PLAYER_NO_LONGER_IN_GAME);
      }

      switchPlayerTeams(gameData, playerName);
      await gameRef.set(gameData);

      return successfulResponse(SUCCESS_SWITCHED_TEAMS);

    } catch (error) {
      console.log("Error switching teams: ", error);
      return failedResponse(ERROR_SWITCHING_TEAMS);
    }
  }
);