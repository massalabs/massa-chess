/** ***********************
 * Create smart contract
 **/

import { print, generate_event, include_base64, create_sc, send_message } from "massa-sc-std"

export function main(name: string): void {
    // create chess_engine
    const bytes = include_base64('./build/chess_engine.wasm');
    const address = create_sc(bytes);

    // inform nodes of the creation
    send_message(address, "get", 1, 1, 20, 1, 100_000, 1, 100, "hello my good friend!");
    const message = "HERE: chess is available at " + address;
    generate_event(message);
    print(message);
}
