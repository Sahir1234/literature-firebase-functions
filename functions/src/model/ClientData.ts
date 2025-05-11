
export class ClientData {
    private gameId: string;
    private playerName: string;
    private uid: string;

    private constructor(gameId: string, playerName: string, uid: string) {
        this.gameId = gameId;
        this.playerName = playerName;
        this.uid = uid;
    }

    public static from(data: any): ClientData {
        return new ClientData(data.gameId, data.playerName, data.uid);
    }

    public getGameId(): string {
        return this.gameId;
    }

    public getPlayerName(): string {
        return this.playerName;
    }

    public getUid(): string {
        return this.uid;
    }

    public toJSON(): object {
        return {
            gameId: this.gameId,
            playerName: this.playerName,
            uid: this.uid
        };
    }

    public isPresent(): boolean {
        const isValid = this.gameId !== null && this.playerName !== null && this.uid !== null;
        if (!isValid) {
            console.error(
                "Missing game initialization data: " +
                "[gameId: " + this.gameId + "], " +
                "[playerName: " + this.playerName + "], " +
                "[uid: " + this.uid + "]!"
            );
        }
        return isValid;
    }
}
