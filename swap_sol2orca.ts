// import { readFile } from "mz/fs";
import { Connection, Keypair } from "@solana/web3.js";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig, Network } from "@orca-so/sdk";
import Decimal from "decimal.js";

const main = async () => {
  /*** Setup ***/
  // 1. Read secret key file to get owner keypair
  // TODO: replace your own private key string here
  const secretKey = Uint8Array.from([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const owner = Keypair.fromSecretKey(secretKey);
  console.log("owner: " + owner.publicKey.toString());

  // 2. Initialzie Orca object with mainnet connection
  // TODO: replace your own rpc and ws url here
  const rpcURL = "https://your-own-rpc-url";
  const wsURL = "wss://your-own-ws-url";
  const connection = new Connection(rpcURL, {
    commitment: "confirmed",
    wsEndpoint: wsURL,
  });
  const orca = getOrca(connection, Network.DEVNET);

  /*** Swap ***/
  // 3. We will be swapping 0.001 SOL for some ORCA
  const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL);
  const solToken = orcaSolPool.getTokenB();
  // TODO: randomize the amount to bypass dedup
  const solAmount = new Decimal(0.001);
  const orcaAmount = new Decimal(0);

  //Submit txs in batches
  // TODO: Feel free to play around with the batchSize parameter
  const batchSize = 350;
  const promises = [];
  var swapTxIds: string[] = [];
  for (let i = 0; i < batchSize; i++) {
    promises.push(
      (
        async () => {
          try {
            // const quote = await orcaSolPool.getQuote(orcaToken, orcaAmount);
            // const solAmount = quote.getMinOutputAmount();
            // console.log(`Swap ${orcaAmount.toString()} ORCA for at least ${solAmount.toNumber()} SOL`);
            const swapPayload = await orcaSolPool.swap(owner, solToken, solAmount, orcaAmount);
            const swapTxId = await swapPayload.execute();
            console.log("Swapped:", swapTxId, "\n");
            swapTxIds.push(swapTxId);
          } catch (err) {
            console.warn(err);
          }
        }
      )()
    );
  }
  await Promise.all(promises).then()
    .catch((e) => {
      console.error(e.message)
    });

  /*** Analytics ***/
  // 5. Log all the slot numbers
  const swapTxSlots = []
  let dict: { [tx: string]: number } = {};
  for (let i = 0; i < swapTxIds.length; i++) {
    swapTxSlots.push(
      (
        async () => {
          try {
            const swapTx = await connection.getTransaction(swapTxIds[i]);
            if (swapTx != null) {
              dict[JSON.stringify(swapTxIds[i])] = swapTx.slot
            }
          } catch (err) {
            console.warn(err);
          }
        }
      )()
    );
  }
  await Promise.all(swapTxSlots).then((v) => {
    console.log(dict)
  })
    .catch((e) => {
      console.error(e.message)
    });
};

main()
  .then(() => {
    console.log("Done");
  })
  .catch((e) => {
    console.error(e);
  });