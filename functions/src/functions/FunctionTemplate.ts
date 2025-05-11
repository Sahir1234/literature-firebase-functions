
import * as functions from "firebase-functions";
import { BackendResponse } from "../model/BackendResponse";
import { ClientData } from "../model/ClientData";
import { GameData } from "../model/GameData";
import { GameActionResult } from "../model/GameActionResult";
import { FirebaseRTDBClient } from "../firebase/FirebaseDBClient";

export class FunctionTemplate {

  private static MISSING_CLIENT_SIDE_DATA = "Missing Game ID, Player Name, or UID!";
  private static GENERIC_FAILURE_MESSAGE = "There is a problem with the server! Please refresh and try again later!";

  public static wrap(gameFunction: (clientData: ClientData, gameData: GameData | null) => GameActionResult) {
    return functions.https.onCall(
      async (request: any, context) => {
        try {
          const clientData = ClientData.from(request.data);
          if (!clientData.isPresent()) {
            return BackendResponse.failedResponse(FunctionTemplate.MISSING_CLIENT_SIDE_DATA);
          }
          
          let gameData = await FirebaseRTDBClient.getGameSnapshot(clientData.getGameId());
          const gameActionResult = gameFunction(clientData, gameData);

          if (gameActionResult === GameActionResult.SUCCESS_CREATE_NEW_GAME) {
            gameData = GameData.createNewGame(clientData.getPlayerName(), clientData.getUid());
          } 

          if (gameActionResult.isSuccess() && gameData) {
            if (gameData.isEmpty()) {
              FirebaseRTDBClient.deleteGameSnapshot(clientData.getGameId());
            } else {
              FirebaseRTDBClient.updateGameSnapshot(clientData.getGameId(), gameData);
            }
          }

          return BackendResponse.createResponseFor(gameActionResult);
    
        } catch (error) {
          console.log("Server side error occurred: ", error);
          return BackendResponse.failedResponse(FunctionTemplate.GENERIC_FAILURE_MESSAGE);
        }
      }
    );
  }
}
