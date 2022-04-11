import React, { useEffect, useState } from 'react';
import './App.css';
import massa from './massa_logo.png'
import { INodeStatus, IAccount, IProvider, ProviderType, Client, IClientConfig } from "massa-web3";
import { Chess } from "chess.js";

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
const chess = new Chess()

while (!chess.game_over()) {
    const moves = chess.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]
    chess.move(move)
}
console.log(chess.pgn())
// END

function App() {

  const [nodeStatus, setNodeStatus] = useState<TNodeStatus>(null);

  const getNodeStatusAsync = async () => {
    try {
      const nodeStatus: INodeStatus = await web3Client.publicApi().getNodeStatus();
      setNodeStatus(nodeStatus);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNodeStatusAsync();
  }, []);

  const getNodeOverview = (nodeStatus?: TNodeStatus): JSX.Element => {
    if (!nodeStatus) {
      return <React.Fragment>"Getting Massa's Node Status..."</React.Fragment>;
    }
    return (<React.Fragment>
      Massa Net Version: {nodeStatus?.version}
      <br />
      Massa Net Node Id: {nodeStatus?.node_id}
      <br />
      Massa Net Node Ip: {nodeStatus?.node_ip}
      <br />
      Massa Net Time:    {nodeStatus?.current_time}
      <br />
      Massa Net Cycle: {nodeStatus?.current_cycle}
      <br />
    </React.Fragment>)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={massa} className="App-logo" alt="logo" />
        {getNodeOverview(nodeStatus)}
      </header>
    </div>
  );
}

export default App;
