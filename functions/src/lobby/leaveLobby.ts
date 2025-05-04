
import * as functions from "firebase-functions";
import { db } from '../utils/firebaseAdmin';
import { ClientData, isValidClientDataPresent } from "../data/clientData";
import { 
  MISSING_CLIENT_SIDE_DATA, 
  SUCCESS_GAME_LEFT,
  ERROR_LEAVING_GAME,
  GAME_HAS_ALREADY_STARTED
} from "../utils/alertMessages";
import { failedResponse, successfulResponse } from "../utils/backendResponse";
import { removePlayerFromGame, isGameEmpty, isGameInLobby } from "../data/gameData";

export const leaveLobby = functions.https.onCall(
  async (request: any, context) => {
    const { gameId, playerName, uid } = request.data as ClientData;

    try {
      if (!isValidClientDataPresent({ gameId, playerName, uid })) {
        return failedResponse(MISSING_CLIENT_SIDE_DATA);
      }

      const gameRef = db.ref(`GAMES/${gameId}`);
      const snapshot = await gameRef.once("value");

      // skip validations since we want to be able to clear client side data
      let gameData = snapshot.val();
      if (!isGameInLobby(gameData)) {
        return failedResponse(GAME_HAS_ALREADY_STARTED);
      }

      removePlayerFromGame(gameData, playerName);
      if (isGameEmpty(gameData)) {
        await gameRef.remove();
      } else {
        await gameRef.set(gameData);
      }
  
      return successfulResponse(SUCCESS_GAME_LEFT);

    } catch (error) {
      console.log("Error leaving game: ", error);
      return failedResponse(ERROR_LEAVING_GAME);
    }
  }
);
