/** ***********************
 * Deploys a smart contract
 **/

import { print, generate_event, Storage, create_sc, call } from "massa-sc-std"

export function main(name: string): void {
    // create chess_engine
    Storage.set_bytecode('./build/chess_engine.wasm');

    // initialize the board
    call("2KziQHMiHmmU3juWPvCYQr1hV3ns8NkXaV3WKH6wV3jycD7SVE", "set", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 100);

    // inform nodes of the creation
    const message = "massa chess is available at 2KziQHMiHmmU3juWPvCYQr1hV3ns8NkXaV3WKH6wV3jycD7SVE";
    generate_event(message);
    print(message);
}
