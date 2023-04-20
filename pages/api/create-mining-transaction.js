import {
  AppWallet,
  ForgeScript,
  Transaction,
  KoiosProvider,
  largestFirst,
} from "@meshsdk/core";
import {demoMnemonic} from "../../config/wallet";


export default async function handler(req, res) {
  var bankWalletAddress= ""
  const utxos = req.body.utxos;
  const asset = req.body.asset;                                           
  const address = asset.recipient.address
  if (address.indexOf('addr1')!=-1){
    bankWalletAddress = process.env.MAINNET_ADDR
  }else if(address.indexOf('addr_test1')!=-1){
    bankWalletAddress = process.env.PREPROD_ADDR
  }else{
    return
  }
  const price = req.body.price
  const costLovelace = `${price+969750}`;
  const blockchainProvider = new KoiosProvider("preview");
  const appWallet = new AppWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: "mnemonic",
      words: demoMnemonic,
    },
  });

  const appWalletAddress = appWallet.getPaymentAddress();
  const forgingScript = ForgeScript.withOneSignature(appWalletAddress);
  const selectedUtxos = largestFirst(costLovelace, utxos, false);
  const tx = new Transaction({ initiator: appWallet });
  tx.setTxInputs(selectedUtxos);
  tx.mintAsset(forgingScript, asset);
  if(req.body.price >0 ){
    tx.sendLovelace(bankWalletAddress, `${price }`);
  }
  tx.setChangeAddress(address);
  const unsignedTx = await tx.build();

  const originalMetadata = Transaction.readMetadata(unsignedTx);

  /**
   * TODO: Here you want to save the `originalMetadata` in a database with the `assetName`
   */

  const maskedTx = Transaction.maskMetadata(unsignedTx);

  // In this starter template, we send `originalMetadata` to the frontend.
  // Not recommended, its better to save the `originalMetadata` in a database.
  res.status(200).json({ maskedTx, originalMetadata });
}