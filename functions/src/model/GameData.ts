import { GameActionResult } from "./GameActionResult";
import { PrivatePlayerData } from "./PrivatePlayerData";
import { PublicGameData } from "./PublicGameData";

export class GameData {

    private static MIN_PLAYERS = 4;
    private static MAX_PLAYERS = 12;

    private public: PublicGameData;
    private private: { [key: string]: PrivatePlayerData };

    private constructor(publicData: PublicGameData, privateData: { [key: string]: PrivatePlayerData }) {
        this.public = publicData;
        this.private = privateData;
    }

    public static from(data: any): GameData {
        const publicData = PublicGameData.from(data.public);
        const privateData: { [key: string]: PrivatePlayerData } = {};
        for (const uid in data.private) {
            privateData[uid] = PrivatePlayerData.from(data.private[uid]);
        }
        return new GameData(publicData, privateData);
    }

    public static createNewGame(playerName: string, uid: string): GameData {
        const publicData = PublicGameData.createNewPublicGame(playerName);
        const privateData = {uid: PrivatePlayerData.createNewPrivateData(playerName)};
        return new GameData(publicData, privateData);
    }

    public toJSON(): object {
        const privateDataJSON: { [key: string]: object } = {};
        for (const key in this.private) {
            privateDataJSON[key] = this.private[key].toJSON();
        }

        return {
            public: this.public.toJSON(),
            private: privateDataJSON
        };
    }

    public isEmpty(): boolean {
        return Object.keys(this.private).length === 0;
    }


    public addPlayer(name: string, uid: string): GameActionResult {
        if (this.private[uid]) {
            throw new Error("Unexpected duplicate UID!");
        }

        if (!this.isInLobby()) {
            return GameActionResult.FAILED_LOBBY_NOT_OPEN;
        } else if (this.isPlayerNameInGame(name)) {
            return GameActionResult.FAILED_PLAYER_ALREADY_IN_GAME;
        } else if (this.isFull()) {
            return GameActionResult.FAILED_GAME_IS_FULL;
        }

        const privateData: PrivatePlayerData = PrivatePlayerData.createNewPrivateData(name);
        this.private[uid] = privateData;
        this.public.addPlayer(name);

        return GameActionResult.SUCCESS;
    }

    public removePlayer(name: string, uid: string): GameActionResult {
        if (!this.isInLobby()) {
            return GameActionResult.FAILED_GAME_HAS_ALREADY_STARTED;
        }

        delete this.private[uid];
        this.public.removePlayer(name);

        return GameActionResult.SUCCESS;
    }

    public switchPlayerTeam(name: string): GameActionResult {
        if (!this.isInLobby()) {
            return GameActionResult.FAILED_GAME_HAS_ALREADY_STARTED;
        }

        this.public.switchPlayerTeam(name);
        return GameActionResult.SUCCESS;
    }

    public beginGame(): GameActionResult {
        if (!this.isInLobby()) {
            return GameActionResult.FAILED_GAME_HAS_ALREADY_STARTED;
        } else if (!this.areTeamsEven()) {
            return GameActionResult.FAILED_NEED_EQUAL_TEAMS;
        } else if (!this.hasRightAmountOfPlayers()) {
            return GameActionResult.FAILED_INCORRECT_AMOUNT_OF_PLAYERS;
        }

        return GameActionResult.SUCCESS;
    }


    // -------------------------------------------------------
    

    private isInLobby(): boolean {
        return this.public.isInLobby();
    }

    private isPlayerNameInGame(name: string) {
        return this.public.isPlayerNameInGame(name);
    }

    private isFull(): boolean {
        return Object.keys(this.private).length >= GameData.MAX_PLAYERS;
    }

    private areTeamsEven(): boolean {
        return this.public.areTeamsEven();
    }

    private hasRightAmountOfPlayers() : boolean {
        const playerCount = Object.keys(this.private).length;
        return playerCount >= GameData.MIN_PLAYERS && playerCount <= GameData.MAX_PLAYERS;
    }
}
