import * as functions from "firebase-functions";
import { db } from '../utils/firebaseAdmin';
import { ClientData, isValidClientDataPresent } from "../data/clientData";
import { 
  ERROR_JOINING_GAME,
  GAME_ID_NOT_FOUND, 
  LOBBY_NOT_OPEN,
  MISSING_CLIENT_SIDE_DATA, 
  SUCCESS_GAME_JOINED,
  PLAYER_ALREADY_IN_GAME
} from "../utils/alertMessages";
import { failedResponse, successfulResponse } from "../utils/backendResponse";
import { addPlayerToGame, GameStatus } from "../data/gameData";

export const joinGame = functions.https.onCall(
  async (request: any, context) => {
    const { gameId, playerName, uid } = request.data as ClientData;

    try {
      if (!isValidClientDataPresent({ gameId, playerName, uid })) {
        return failedResponse(MISSING_CLIENT_SIDE_DATA);
      }

      const gameRef = db.ref(`GAMES/${gameId}`);
      const snapshot = await gameRef.once("value");

      if (!snapshot.exists()) {
        return failedResponse(GAME_ID_NOT_FOUND);
      }

      let gameData = snapshot.val();

      if (gameData.status !== GameStatus.IN_LOBBY) {
        return failedResponse(LOBBY_NOT_OPEN);
      }

      const playerData = gameData.players;
      if (playerData[playerName]) {
        return failedResponse(PLAYER_ALREADY_IN_GAME);
      }

      addPlayerToGame(gameData, playerName, uid);
      await gameRef.set(gameData);
  
      return successfulResponse(SUCCESS_GAME_JOINED);

    } catch (error) {
      console.log("Error joining game: ", error);
      return failedResponse(ERROR_JOINING_GAME);
    }
  }
);
