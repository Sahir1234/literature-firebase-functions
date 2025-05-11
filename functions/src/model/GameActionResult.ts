
export class GameActionResult {
  private message: string;

  private constructor(message: string) {
    this.message = message;
  }

  public static SUCCESS = new GameActionResult("Success!");
  public static SUCCESS_CREATE_NEW_GAME = new GameActionResult("Successfully created a new game!");

  public static FAILED_GAME_ID_IN_USE = new GameActionResult("Game ID is currently in use. Please pick a new one.");
  public static FAILED_GAME_ID_NOT_FOUND = new GameActionResult("Game ID not found. Please check the ID and try again.");
  public static FAILED_LOBBY_NOT_OPEN = new GameActionResult("This lobby is not open. Please choose a different game ID.");
  public static FAILED_PLAYER_ALREADY_IN_GAME = new GameActionResult("A player with that name is already in the game. Please try a different name.");
  public static FAILED_GAME_IS_FULL = new GameActionResult("The game is full already. Please join a different game.");
  public static FAILED_GAME_HAS_ALREADY_STARTED = new GameActionResult("The game has started. You cannot leave a game that has already started.");
  public static FAILED_NEED_EQUAL_TEAMS = new GameActionResult("We need equal sized teams to begin the game!");
  public static FAILED_INCORRECT_AMOUNT_OF_PLAYERS = new GameActionResult("We need between 4 and 12 players to begin the game!");

  public getMessage(): string {
    return this.message;
  }

  public isSuccess(): boolean {
    return this === GameActionResult.SUCCESS || this === GameActionResult.SUCCESS_CREATE_NEW_GAME;
  }
}