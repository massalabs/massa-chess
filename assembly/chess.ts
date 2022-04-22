/** ***********************
 * Chess SC
 **/

import { Storage } from "massa-sc-std"

export function set(fen: string): void {
    // check if it is a valid move here
    Storage.set_data("fen_board_state", fen);
}
