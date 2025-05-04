
export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 12;

enum GameStatus {
    "IN_LOBBY",
    "IN_PROGRESS",
    "GAME_OVER"
}

export interface GameData {
    public: PublicGameData,
    private: {
        [key: string]: PlayerData;
    };
}

export interface PublicGameData {
    status: GameStatus;
    host: string;
    redTeam: string[];
    blueTeam: string[];
}

export interface PlayerData {
    name: string,
    uid: string,
    hand: string[],
}

export const createNewGame = (playerName: string, uid: string): GameData => {
    return {
        public: {
            status: GameStatus.IN_LOBBY,
            host: playerName,
            redTeam: [playerName],
            blueTeam: []
        },
        private: {
            [playerName]: {
                name: playerName,
                uid: uid,
                hand: []
            }
        }
    };
}

export const addPlayerToGame = (gameData: GameData, playerName: string, uid: string) => {
    const newPlayer = {
        name: playerName,
        uid: uid,
        hand: []
    };

    gameData.private[playerName] = newPlayer;

    const redTeamSize = gameData.public.redTeam ? gameData.public.redTeam.length : 0;
    const blueTeamSize = gameData.public.blueTeam ? gameData.public.blueTeam.length : 0;
    if (redTeamSize < blueTeamSize) {
        addPlayerToRedTeam(gameData, playerName);
    } else {
        addPlayerToBlueTeam(gameData, playerName);
    }
}

export const removePlayerFromGame = (gameData: GameData, playerName: string) => {
    const privateData = gameData.private;
    if (privateData[playerName]) {
        delete privateData[playerName];
    }
    if (gameData.public.host === playerName) {
        assignNewHost(gameData);
    }

    if (isPlayerOnRedTeam(gameData, playerName)) {
        removePlayerFromRedTeam(gameData, playerName);
    } else {
        removePlayerFromBlueTeam(gameData, playerName);
    }
}

const assignNewHost = (gameData: GameData) => {
    if (!isGameEmpty(gameData)) {
        const newHost = Object.keys(gameData.private)[0];
        gameData.public.host = newHost;
    } else {
        gameData.public.host = '';
    }
}

export const isPlayerInGame = (gameData: GameData, playerName: string, uid: string) => {
    const privateData = gameData.private;
    return privateData[playerName];
}

export const switchPlayerTeams = (gameData: GameData, playerName: string) => {
    if (isPlayerOnRedTeam(gameData, playerName)) {
        removePlayerFromRedTeam(gameData, playerName);
        addPlayerToBlueTeam(gameData, playerName);
    } else {
        removePlayerFromBlueTeam(gameData, playerName);
        addPlayerToRedTeam(gameData, playerName);
    }
}

const addPlayerToRedTeam = (gameData: GameData, playerName: string) => {
    if (!(gameData.public.redTeam)) {
        gameData.public.redTeam = [];
    }
    gameData.public.redTeam.push(playerName);
}

const addPlayerToBlueTeam = (gameData: GameData, playerName: string) => {
    if (!(gameData.public.blueTeam)) {
        gameData.public.blueTeam = [];
    }
    gameData.public.blueTeam.push(playerName);
}

const isPlayerOnRedTeam = (gameData: GameData, playerName: string) => {
    if (!(gameData.public.redTeam)) {
        return false;
    }
    return gameData.public.redTeam.indexOf(playerName) !== -1;
}

const removePlayerFromRedTeam = (gameData: GameData, playerName: string) => {
    if (gameData.public.redTeam) {
        const index = gameData.public.redTeam.indexOf(playerName);
        gameData.public.redTeam.splice(index, 1);
    }
}

const removePlayerFromBlueTeam = (gameData: GameData, playerName: string) => {
    if (gameData.public.blueTeam) {
        const index = gameData.public.blueTeam.indexOf(playerName);
        gameData.public.blueTeam.splice(index, 1);
    }
}

export const areTeamsEven = (gameData: GameData) => {
    return gameData.public.blueTeam.length === gameData.public.redTeam.length;
}

export const isGameEmpty = (gameData: GameData) => {
    return Object.keys(gameData.private).length === 0;
}

export const isGameFull = (gameData: GameData) => {
    return Object.keys(gameData.private).length == MAX_PLAYERS;
}

export const isGameInLobby = (gameData: GameData) => {
    return gameData.public.status === GameStatus.IN_LOBBY;
}

export const doesGameHaveTooFewPeopleToStart = (gameData: GameData) {
    return (gameData.public.redTeam.length + gameData.public.blueTeam.length) < MIN_PLAYERS;
}

export const doesGameHaveTooManyPeopleToStart = (gameData: GameData) {
    return (gameData.public.redTeam.length + gameData.public.blueTeam.length) > MAX_PLAYERS;
}


export const beginGame = (gameData: GameData) => {
    gameData.public.status = GameStatus.IN_PROGRESS;

    // need to set up the logic to create the hands and set up the deck
}
