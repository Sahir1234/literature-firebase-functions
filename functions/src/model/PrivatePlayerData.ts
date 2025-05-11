
export class PrivatePlayerData {
    private name: string;
    private hand: string[];

    private constructor(name: string) {
        this.name = name;
        this.hand = [];
    }

    public static from(data: any): PrivatePlayerData {
        return new PrivatePlayerData(data.name);
    }

    public static createNewPrivateData(playerName: string) {
        return new PrivatePlayerData(playerName);
    }

    public toJSON(): object {
        return {
            name: this.name,
            hand: this.hand
        };
    }
}
