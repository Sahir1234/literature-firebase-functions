
import { db } from "./FirebaseAdmin";
import { GameData } from "../model/GameData";

export class FirebaseRTDBClient {

    public static async getGameSnapshot(gameId: string) {
        const gameRef = db.ref(`${gameId}`);
        const snapshot = await gameRef.once("value");

        if (!snapshot.exists()) {
            return null;
        }

        return GameData.from(snapshot.val());
    }

    public static updateGameSnapshot(gameId: string, game: GameData) {
        const gameRef = db.ref(`${gameId}`);
        gameRef.set(game);
    }

    public static deleteGameSnapshot(gameId: string) {
        const gameRef = db.ref(`${gameId}`);
        gameRef.remove();
    }
}