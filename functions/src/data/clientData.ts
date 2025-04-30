
export interface ClientData {
    gameId: string;
    playerName: string;
    uid: string;
  }

export const isValidClientDataPresent = (data: ClientData): boolean => {
    if (!data.gameId || !data.playerName || !data.uid) {
        console.log("Missing game initialization data: ");
        console.log("gameId: ", data.gameId);
        console.log("playerName: ", data.playerName);
        console.log("uid: ", data.uid);
        return false;
    }
    
    return true;
}