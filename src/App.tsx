import { useState } from 'react';
import './App.css';
import { IAccount, IProvider, ProviderType, Client, IClientConfig, ICallData, IAddressInfo } from "massa-web3";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const chessSC: string = "2Dwo8HyxSophSgwA61f6Rfg6YUTTMXM3we91T5sPg2XqgnXcgq";

// START
const baseAccount = {
  publicKey: "5Jwx18K2JXacFoZcPmTWKFgdG1mSdkpBAUnwiyEqsVP9LKyNxR",
  privateKey: "2SPTTLK6Vgk5zmZEkokqC3wgpKgKpyV5Pu3uncEGawoGyd4yzC",
  address: "9mvJfA4761u1qT8QwSWcJ4gTDaFP5iSgjQzKMaqTbrWCFo1QM"
} as IAccount;

const providers: Array<IProvider> = [
  {
    url: "http://127.0.0.1:33035",
    type: ProviderType.PUBLIC
  } as IProvider,
  {
    url: "http://127.0.0.1:33034",
    type: ProviderType.PRIVATE
  } as IProvider
];

const web3ClientConfig = {
  providers,
  retryStrategyOn: true,  // activate the backoff retry strategy
  periodOffset: 3         // set an offset of a few periods (default = 5)
} as IClientConfig;

const web3Client: Client = new Client(web3ClientConfig, baseAccount);
// END

let board: string = "";

function GetBoard() {
  web3Client
    .publicApi()
    .getAddresses([chessSC]).then((x: any) => {
      board = String.fromCharCode(...x[0]['candidate_sce_ledger_info']['datastore']['2KDMgrjWrVvtv8RGy9dTxYBEGAFtuRLYUT5Qwto2Ro3gL8h8Nx']);
      console.log("1");
      console.log(board);
    });
}

// START
function ChessEngine() {
  console.log("START ENGINE")
  // note: use this
  // GetBoard();
  let [game, setGame] = useState(new Chess("rnbqkb1r/pppp1ppp/4p2n/8/8/4PP2/PPPP2PP/RNBQKBNR w KQkq - 1 3"));
  console.log("2");
  console.log(board);

  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game: any) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare: any, targetSquare: any) {
    let move = null;
    safeGameMutate((game: any) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    });
    if (move === null) {
      console.log("ILLEGAL MOVE");
      return false;
    }
    makeRandomMove();
    console.log(game.fen());
    web3Client.smartContracts().callSmartContract({
      fee: 0,
      maxGas: 10_000_000,
      gasPrice: 0,
      parallelCoins: 0,
      sequentialCoins: 0,
      targetAddress: chessSC,
      functionName: "set",
      parameter: game.fen(),
    } as ICallData, baseAccount).then(console.log);
    return true;
  }

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}
// END

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {ChessEngine()}
      </header>
    </div>
  );
}

export default App;
