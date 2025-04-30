import * as functions from "firebase-functions";
import { db } from '../utils/firebaseAdmin';
import { ClientData, isValidClientDataPresent } from "../data/clientData";
import { GameStatus } from "../data/gameData";
import { 
  ERROR_JOINING_GAME,
  GAME_ID_NOT_FOUND,
  MISSING_CLIENT_SIDE_DATA
} from "../utils/alertMessages";
import { failedResponse, successfulResponse } from "../utils/backendResponse";

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

      const gameData = snapshot.val();
      const playerData = gameData.players;
      const thisPlayerData = playerData[playerName];

      if (!thisPlayerData || thisPlayerData.uid !== uid) {
        return failedResponse(MISSING_CLIENT_SIDE_DATA);
      }

      if (gameData.status === GameStatus.IN_LOBBY) {
        return successfulResponse("lobby");
      } else {
        return successfulResponse("games");
      }

    } catch (error) {
      console.log("Error joining game: ", error);
      return failedResponse(ERROR_JOINING_GAME);
    }
  }
);
