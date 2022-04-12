/** ***********************
 * Chess SC
 **/

import { Context, Storage, print } from "massa-sc-std"

export function set(fen: string): void {
    const addresses = Context.get_call_stack();
    const sc_address = addresses[addresses.length - 1]
    print("NEW BOARD STATE: " + fen);
    // note: atleast check if player is the same
    Storage.set_data("fen_board_state", fen);
}
