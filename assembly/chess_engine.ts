/** ***********************
 * Chess SC
 **/

import { Context, Storage, print } from "massa-sc-std"

export function set(fen: string): void {
    print("CALL SET");
    const addresses = Context.get_call_stack();
    const sc_address = addresses[addresses.length - 1]
    // note: atleast check if player is the same
    Storage.set_data("fen_board_state", fen);
}

export function get(_: string): string {
    print("CALL GET");
    return Storage.get_data("fen_board_state");
}
