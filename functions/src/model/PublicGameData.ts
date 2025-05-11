
enum GameStatus {
    IN_LOBBY,
    IN_PROGRESS,
    GAME_OVER
}

export class PublicGameData {

    private status: GameStatus;
    private host: string;
    private redTeam: string[];
    private blackTeam: string[];

    private constructor(status: GameStatus, host: string, redTeam: string[] = [], blackTeam: string[] = []) {
        this.status = status;
        this.host = host;
        this.redTeam = redTeam;
        this.blackTeam = blackTeam;
    }

    public static from(data: any): PublicGameData {
        return new PublicGameData(
            data.status,
            data.host,
            data.redTeam || [],
            data.blackTeam || []
        );
    }

    public static createNewPublicGame(playerName: string): PublicGameData {
        return new PublicGameData(GameStatus.IN_LOBBY, playerName, [playerName], []);
    }

    public toJSON(): object {
        return {
            status: this.status,
            host: this.host,
            redTeam: this.redTeam,
            blackTeam: this.blackTeam
        };
    }
    
    public isInLobby(): boolean {
        return this.status === GameStatus.IN_LOBBY;
    }

    public isPlayerNameInGame(name: string): boolean {
        return name in this.redTeam || name in this.blackTeam;
    }

    public addPlayer(name: string): void {
        if (this.redTeam.length <= this.blackTeam.length) {
            this.redTeam.push(name);
        } else {
            this.blackTeam.push(name);
        }
    }

    public removePlayer(name: string): void {
        this.removePlayerFromTeams(name);

        if (this.host === name) {
            this.assignNewHost();
        }
    }

    private assignNewHost(): void {
        if (this.redTeam.length > 0) {
            this.host = this.redTeam[0];
        } else if (this.blackTeam.length > 0) {
            this.host = this.blackTeam[0];
        } else {
            // game is empty and will be deleted anyway
            this.host = "";
        }
    }

    public areTeamsEven(): boolean {
        return this.redTeam.length === this.blackTeam.length;
    }

    public switchPlayerTeam(name: string) {
        if (name in this.redTeam) {
            this.removePlayerFromTeams(name);
            this.blackTeam.push(name);
        } else if (name in this.blackTeam) {
            this.removePlayerFromTeams(name);
            this.redTeam.push(name);
        }
    }

    private removePlayerFromTeams(name: string) {
        this.redTeam = this.redTeam.filter(p => p !== name);
        this.blackTeam = this.blackTeam.filter(p => p !== name);
    }
}
