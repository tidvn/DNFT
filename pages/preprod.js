import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useState,useCallback  } from "react";
import { UpToIPFS,createTransactionPreprod, signTransaction } from "../backend";
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
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    assetName: "",
    file: null,
    Credit: false
  });
  const [metadata, setMetadata] = useState({});
  const [credit, setCredit] = useState({MintBy:"DNFT"});
  const [price, setPrice] = useState(0);

  const [groups, setGroups] = useState([]);



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
        setPrice(10000000)
        setCredit({})
        // setMetadata(Object.fromEntries(Object.entries(metadata).filter(([key]) => key !== 'MintBy')))
      }else{
        setPrice(0)
        setCredit({MintBy:"DNFT"})
      }
    }
    else{
      setFormdata({ ...formdata, [e.target.name]: e.target.value });
    }
  }


  async function startMintNFT() {
    
    setLoading(true);   
    try {
      const recipientAddress = await wallet.getChangeAddress();
      const utxos = await wallet.getUtxos();
      const pinned = await UpToIPFS(formdata.file)
      const asset = {
        assetName: formdata.assetName,
        assetQuantity: "1",
        metadata: {...metadata,image:pinned.data.IpfsHash,mediaType: formdata.file.type,...credit},
        label: "721",
        recipient: {
          address: recipientAddress,
        },
      };
      const {maskedTx, originalMetadata } = await createTransactionPreprod(
        utxos,
        asset,
        price
        );
        const signedTx = await wallet.signTx(maskedTx, true);

      const { appWalletSignedTx } = await signTransaction(
        signedTx,
        originalMetadata
      );

      const txHash = await wallet.submitTx(appWalletSignedTx);

      setTxHash(txHash);

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }


  return (
  <div className="container mt-10 sm:mt-0">
  <div className="md:grid md:grid-cols-3 md:gap-6">

    <div className="mt-5 md:col-span-2 md:mt-0">
     
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 lg:col-span-8">
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                NFT Name
                </label>
                <input type="text" name="assetName"  onChange={handleChange} value={formdata.assetName} placeholder="Asset Name"  className="input input-bordered input-success w-full" />

              </div>
              <div className="col-span-6 lg:col-span-8">
                <label htmlFor="Amount" className="block text-sm font-medium text-gray-700">
                Image
                </label>
                <input type="file" name="file" onChange={handleChange} className="file-input file-input-bordered file-input-accent w-full" />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-6">
              <label></label>
            <div className="col-span-6 lg:col-span-8">
            <div className="form-control">
            <div className="input-group">
            <button onClick={handleAddGroup} className="btn">Add metadata</button>           
              <label className="label cursor-pointer">
                <span className="bg-transparent" >Remove Credit</span> 
                <input type="checkbox" name="Credit" onChange={handleChange} className="toggle"  checked={formdata.Credit} />
              </label>
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
            </div>
         
              
          </div>
          
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              {connected ? (
              <button className="btn btn-success"
                type="button"
                onClick={() => startMintNFT()}
                disabled={loading}
              >
                {loading ? "Creating transaction..." : "Mint Token"}
              </button>
            ) : (
              <CardanoWallet />
            )}
            {txHash && (
              <div>
                <p>Successful, transaction hash:</p>
                <code>{txHash}</code>
              </div>
            )}
            
          </div>
        </div>
      
    </div>
  </div>
</div>
  );
}
