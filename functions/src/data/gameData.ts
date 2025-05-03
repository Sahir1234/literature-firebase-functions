
export enum GameStatus {
    "IN_LOBBY",
    "IN_PROGRESS",
    "GAME_OVER"
}


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

export const removePlayerFromGame = (gameData: GameData, playerName: string) => {
    const playerData = gameData.players;
    if (playerData[playerName]) {
        delete playerData[playerName];
    }
}
