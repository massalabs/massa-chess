/** ***********************
 * Chess SC
 **/

import { Context, Storage } from "massa-sc-std"

export function set(fen: string): void {
    const addresses = Context.get_call_stack();
    const sc_address = addresses[addresses.length - 1]
    // note: check if player is same here
    Storage.set_data("fen_board_state", fen);
}

export function get(_: string): string {
    return Storage.get_data("fen_board_state");
}
