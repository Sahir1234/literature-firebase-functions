import { FunctionTemplate } from "./functions/FunctionTemplate";
import { createGameFunction, joinGameFunction } from "./functions/home";
import { leaveLobbyFunction, startGameFunction, switchTeamsFunction } from "./functions/lobby";

export const createGame = FunctionTemplate.wrap(createGameFunction);
export const joinGame = FunctionTemplate.wrap(joinGameFunction);

export const leaveLobby = FunctionTemplate.wrap(leaveLobbyFunction);
export const switchTeams = FunctionTemplate.wrap(switchTeamsFunction);
export const startGame = FunctionTemplate.wrap(startGameFunction);
