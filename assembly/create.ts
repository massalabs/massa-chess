/** ***********************
 * Create smart contract
 **/

import { print, generate_event, include_base64, create_sc, call } from "massa-sc-std"

export function main(name: string): void {
    // create chess_engine
    const bytes = include_base64('./build/chess_engine.wasm');
    const address = create_sc(bytes);

    // initialize the board
    call(address, "set", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 100);

    // inform nodes of the creation
    const message = "massa chess is available at " + address;
    generate_event(message);
    print(message);
}
