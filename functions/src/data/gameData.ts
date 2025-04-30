
export enum GameStatus {
    "IN_LOBBY",
    "IN_PROGRESS",
    "FINISHED"
}

// NEED TO MAKE SURE WE HAVE THE GAME DATA TOO
export interface GameData {
    status: GameStatus;
    players: {
        [key: string]: {
            name: string;
            uid: string;
            team: boolean;
        };
    };

}

export const createNewGame = (playerName: string, uid: string): GameData => {
    return {
        status: GameStatus.IN_LOBBY,
        players: {
            [playerName]: {
                name: playerName,
                uid: uid,
                team: true
            }
        }
    };
}

export const addPlayerToGame = (gameData: GameData, playerName: string, uid: string) => {
    const playerData = gameData.players;
    const assignedTeam = Object.keys(playerData).length % 2 === 0 ? true : false;

    const newPlayer = {
        name: playerName,
        uid: uid,
        team: assignedTeam
    };

    playerData[playerName] = newPlayer;
}