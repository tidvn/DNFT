import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useState,useCallback  } from "react";
import { UpToIPFS } from "../backend";
import {
  ForgeScript,
  Transaction,
} from "@meshsdk/core";
import Link from "next/link";
const GroupInput = ({ id, MDName, MDValue, onChange, onRemove }) => {
  return (
    <div className="col-span-6 lg:col-span-8">
                <div className="form-control">
  <div className="input-group">
    <input type="text" value={MDName} onChange={(e) => onChange(id, "MDName", e.target.value)} placeholder="MetaData Name" className="input input-bordered input-success w-1/2" />
    <input type="text" value={MDValue} onChange={(e) => onChange(id, "MDValue", e.target.value)} placeholder="MetaData Value" className="input input-bordered input-success w-1/2" />
    <button  className="btn" onClick={() => onRemove(id)}>Remove</button>
  </div>
</div>
    </div>
  );
};

export default function mNFT() {
  const { wallet, connected } = useWallet();
  const [txHash, setTxHash] = useState(null);
  const [status, setStatus] = useState("");
  const [disable, setDisable] = useState(false);
  const [formdata, setFormdata] = useState({
    assetName: "",
    file: null,
    Credit: true
  });
  const [metadata, setMetadata] = useState({});
  const [credit, setCredit] = useState({});
  const [price, setPrice] = useState(1000000);
  const [network, setNetwork] = useState("");
  const [groups, setGroups] = useState([{id: '1', MDName: 'name', MDValue: ''},{id: '2', MDName: 'description', MDValue: ''}]);

  const handleAddGroup = useCallback(() => {
    const newGroupId = Date.now().toString();
    const newGroup = { id: newGroupId, MDName: '', MDValue: '' };
    setGroups([...groups, newGroup]);
  }, [groups]);

  const handleRemoveGroup = useCallback((groupIdToRemove) => {
    setGroups(groups.filter(group => group.id !== groupIdToRemove));
  }, [groups]);

  const handleInputChange = useCallback((groupId, field, newValue) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return { ...group, [field]: newValue };
      }
      return group;
    }));
    setMetadata(Object.fromEntries(groups.map(group =>  [group.MDName, group.MDValue])));
  }, [groups]);

  function handleChange(e) {
    if (e.target.files) {
      setFormdata({ ...formdata, [e.target.name]: e.target.files[0] });
    }else if(e.target.type == 'checkbox'){
      setFormdata({ ...formdata, [e.target.name]: e.target.checked });
      if (e.target.checked){
        setPrice(1000000)
        setCredit({})
      }else{
        setPrice(0)
        setCredit({MintedBy:process.env.AUTHOR})
      }
    }
    else{
      setFormdata({ ...formdata, [e.target.name]: e.target.value });
    }
  }

  async function startMintNFT() {
    if(formdata.assetName == "" || formdata.file == null){
      alert("looks like you forgot something")
      return
    }
    setDisable(true)
    setStatus("Starting mint...");   
    try {
      const recipientAddress = await wallet.getChangeAddress();
      setStatus("Up file to IPFS..."); 
      const pinned = await UpToIPFS(formdata.file)
      setStatus("Creating transaction..."); 
      const asset = {
        assetName: formdata.assetName,
        assetQuantity: "1",
        metadata: {...metadata,image:`ipfs://${pinned.data.IpfsHash}`,mediaType: formdata.file.type,...credit},
        label: "721",
        recipient: {
          address: recipientAddress,
        },
      };

//////////////// create TXT
         var bankWalletAddress= ""                                          
        const address = asset.recipient.address
        if (address.indexOf('addr1')!=-1){
          bankWalletAddress = process.env.MAINNET_ADDR
        }else if(address.indexOf('addr_test1')!=-1){
          setNetwork("preprod.")
          bankWalletAddress = process.env.PREPROD_ADDR
        }else{
          return
        }        
        const forgingScript = ForgeScript.withOneSignature(recipientAddress);
        const tx = new Transaction({ initiator: wallet });
        tx.mintAsset(forgingScript, asset);
        if(price >0 ){
          tx.sendLovelace(bankWalletAddress, `${price}`);
        }
        tx.setChangeAddress(recipientAddress);
        const unsignedTx = await tx.build();
////////////////////

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      setTxHash(txHash);

    } catch (error) {
      console.error(error);
    }
    setStatus("");
  }


  return (
    <>
    <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">          
          <div className="text-start">
          <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              {/* html */}
              <div className="col-span-6 lg:col-span-8" >
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  
                Asset Name 
                </label>
                <input  type="text" name="assetName"  onChange={handleChange} value={formdata.assetName} placeholder="Asset Name"  className="input input-bordered input-success w-full" />
                
                
                <label className="label-text">The NFT name is used to distinguish it from other NFTs. Therefore, you should not set this name the same as others</label>

              </div>
               {/* html */}
              <div className="col-span-6 lg:col-span-8">
                <label htmlFor="Amount" className="block text-sm font-medium text-gray-700">
                Image
                </label>
                <input type="file" name="file" onChange={handleChange} className="file-input file-input-bordered file-input-accent w-full" />
              </div>
               {/* html */}
            <div className="col-span-6 lg:col-span-8">
            <div className="form-control">
            <div className="input-group">
            <button onClick={handleAddGroup} className="btn">Add metadata</button>           
              <label className="label cursor-pointer">
                <span className="bg-transparent" >Remove "MintedBy:..." in metadata</span> 
                <input type="checkbox" name="Credit" onChange={handleChange} className="toggle toggle-success"  checked={formdata.Credit} />
              </label>
              {price > 0 && (<button disabled className="bg-transparent mx-5">cost: {price/1000000} ADA</button>)}
                  
              </div>
            </div>
            </div>
            
            {groups.map(group => (
              <GroupInput
                key={group.id}
                id={group.id}
                MDName={group.MDName}
                MDValue={group.MDValue}
                onChange={handleInputChange}
                onRemove={handleRemoveGroup}
              />
            ))}
             
             <div className="col-span-6 lg:col-span-8" >
            {connected ? (
              <button  className="flex items-center justify-center
              font-semibold text-lg
              bg-green-500
              text-slate-50
              border rounded-md
              w-60 px-4 py-3
              shadow-sm"
                type="button"
                onClick={() => startMintNFT()}
                disabled={disable}
              >
                {status !="" ? status : "Start Mint"}
              </button>
            ) : (
              <CardanoWallet />
            )}
            {txHash && (
              <div className="mt-5 text-center">
                <p>Successful, transaction hash:</p>
                <Link href={`https://${network}cardanoscan.io/transaction/${txHash}`}>{txHash}</Link>
              </div>
            )}
            
            </div>

            

              
            </div>
            </div>
            </div>
            </div>
        </div>
        
         <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
      </div>
    </>
  );
}
