import { useState } from 'react';
import './App.css';
import { INodeStatus, IAccount, IProvider, ProviderType, Client, IClientConfig } from "massa-web3";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

// START
const baseAccount = {
  publicKey: "5Jwx18K2JXacFoZcPmTWKFgdG1mSdkpBAUnwiyEqsVP9LKyNxR",
  privateKey: "2SPTTLK6Vgk5zmZEkokqC3wgpKgKpyV5Pu3uncEGawoGyd4yzC",
  address: "9mvJfA4761u1qT8QwSWcJ4gTDaFP5iSgjQzKMaqTbrWCFo1QM"
} as IAccount;

type TNodeStatus = INodeStatus | null;

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

// START
function PlayRandomMoveEngine() {
  const [game, setGame] = useState(new Chess());

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
     // illegal move
    if (move === null)
      return false;
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}
// END

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {PlayRandomMoveEngine()}
      </header>
    </div>
  );
}

export default App;
