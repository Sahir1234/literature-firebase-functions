
import * as functions from "firebase-functions";
import { db } from '../utils/firebaseAdmin';
import { ClientData, isValidClientDataPresent } from "../data/clientData";
import { 
  MISSING_CLIENT_SIDE_DATA, 
  SUCCESS_GAME_LEFT,
  ERROR_LEAVING_GAME,
  GAME_HAS_ALREADY_STARTED,
  NOT_ENOUGH_PLAYERS,
  TOO_MANY_PLAYERS,
  NEED_EQUAL_TEAMS
} from "../utils/alertMessages";
import { failedResponse, successfulResponse } from "../utils/backendResponse";
import { beginGame, MIN_PLAYERS, MAX_PLAYERS, areTeamsEven, isGameInLobby, doesGameHaveTooFewPeopleToStart, doesGameHaveTooManyPeopleToStart } from "../data/gameData";

export const startGame = functions.https.onCall(
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

      if (!areTeamsEven(gameData)) {
        return failedResponse(NEED_EQUAL_TEAMS);
      }

      if (doesGameHaveTooFewPeopleToStart(gameData)) {
        return failedResponse(NOT_ENOUGH_PLAYERS);
      } else if (doesGameHaveTooManyPeopleToStart(gameData)) {
        return failedResponse(TOO_MANY_PLAYERS);
      }

      beginGame(gameData);
      await gameRef.set(gameData);
  
      return successfulResponse(SUCCESS_GAME_LEFT);

    } catch (error) {
      console.log("Error leaving game: ", error);
      return failedResponse(ERROR_LEAVING_GAME);
    }
  }
);
