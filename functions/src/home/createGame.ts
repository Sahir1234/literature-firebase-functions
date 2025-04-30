import * as functions from "firebase-functions";
import { db } from '../utils/firebaseAdmin';
import { ClientData, isValidClientDataPresent } from "../data/clientData";
import { 
  ERROR_CREATING_GAME,
  GAME_ID_IN_USE, 
  MISSING_CLIENT_SIDE_DATA,
  SUCCESS_GAME_CREATED
} from "../utils/alertMessages";
import { failedResponse, successfulResponse } from "../utils/backendResponse";
import { createNewGame } from "../data/gameData";

export const createGame = functions.https.onCall(
  async (request: any, context) => {
    const { gameId, playerName, uid } = request.data as ClientData;

    try {
      if (!isValidClientDataPresent({ gameId, playerName, uid })) {
        return failedResponse(MISSING_CLIENT_SIDE_DATA);
      }

      const gameRef = db.ref(`GAMES/${gameId}`);
      const snapshot = await gameRef.once("value");

      if (snapshot.exists()) {
        return failedResponse(GAME_ID_IN_USE);
      }

      const newGame = createNewGame(playerName, uid);
      await gameRef.set(newGame);
  
      return successfulResponse(SUCCESS_GAME_CREATED);

    } catch (error) {
      console.log("Error creating game: ", error);
      return failedResponse(ERROR_CREATING_GAME);
    }
  }
);
