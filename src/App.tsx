import { useState, useEffect } from 'react';
import './App.css';
import { IAccount, IProvider, ProviderType, Client, IClientConfig, ICallData } from "massa-web3";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const chessSC: string = "2Dwo8HyxSophSgwA61f6Rfg6YUTTMXM3we91T5sPg2XqgnXcgq";

const baseAccount = {
  publicKey: "5Jwx18K2JXacFoZcPmTWKFgdG1mSdkpBAUnwiyEqsVP9LKyNxR",
  privateKey: "2SPTTLK6Vgk5zmZEkokqC3wgpKgKpyV5Pu3uncEGawoGyd4yzC",
  address: "9mvJfA4761u1qT8QwSWcJ4gTDaFP5iSgjQzKMaqTbrWCFo1QM"
} as IAccount;

const providers: Array<IProvider> = [
  {
    url: "http://51.75.131.129:33035",
    type: ProviderType.PUBLIC
  } as IProvider,
  {
    url: "http://51.75.131.129:33034",
    type: ProviderType.PRIVATE
  } as IProvider
];

const web3ClientConfig = {
  providers,
  retryStrategyOn: true,
  periodOffset: 3
} as IClientConfig;

const web3Client: Client = new Client(web3ClientConfig, baseAccount);

async function GetBoard() {
  let addr: any = await web3Client
    .publicApi()
    .getAddresses([chessSC]);
  let board: string = String.fromCharCode(...addr[0]['candidate_sce_ledger_info']['datastore']['2KziQHMiHmmU3juWPvCYQr1hV3ns8NkXaV3WKH6wV3jycD7SVE']);
  return board.replace(/['"]+/g, '');
}

function ChessEngine() {
  let [game, setGame] = useState(new Chess());

  useEffect(() => {
    const fetchData = async () => {
      let board: string = await GetBoard();
      console.log("from sc: " + board);
      game.load(board);
    }

    fetchData()
      .catch(console.error);
  }, []);

  function safeGameMutate(modify: any) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      game.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      return;
    }
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
      console.log("invalid move");
      return false;
    }
    makeRandomMove();
    web3Client.smartContracts().callSmartContract({
      fee: 0,
      maxGas: 1_000_000,
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
