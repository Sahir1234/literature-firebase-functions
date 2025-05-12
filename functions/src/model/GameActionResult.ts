
export class GameActionResult {
  private message: string;

  private constructor(message: string) {
    this.message = message;
  }

  public static SUCCESS_CREATE_NEW_GAME = new GameActionResult("Successfully created a new game!");
  public static SUCCESS_LEFT_GAME = new GameActionResult("Successfully left game!");
  public static SUCCESS_JOINED_GAME = new GameActionResult("Successfully joined game!");
  public static SUCCESS_SWITCHED_TEAMS = new GameActionResult("Switched teams!");
  public static SUCCESS_BEGAN_GAME = new GameActionResult("The game has begun!");

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
    return this === GameActionResult.SUCCESS_CREATE_NEW_GAME ||
           this === GameActionResult.SUCCESS_LEFT_GAME ||
           this === GameActionResult.SUCCESS_JOINED_GAME ||
           this === GameActionResult.SUCCESS_SWITCHED_TEAMS ||
           this === GameActionResult.SUCCESS_BEGAN_GAME;
  }
}