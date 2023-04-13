import axios from "axios";

const instance = axios.create({
  baseURL: `/api/`,
  withCredentials: true,
});

export async function post(route, body = {}) {
  return await instance
    .post(`${route}`, body)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export async function createTransactionMainnet( utxos,asset,price) {
  return await post(`create-mining-transaction-mainnet`, {utxos, asset,price });
}
export async function createTransactionPreprod( utxos,asset,price) {
  return await post(`create-mining-transaction-preprod`, {utxos, asset,price });
}
export async function signTransaction(signedTx, originalMetadata) {
  return await post(`sign-transaction`, {
    signedTx,
    originalMetadata,
  });
}

export async function UpToIPFS(file) {
  const formData = new FormData();   
    formData.append('file', file)    
    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);  
  
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",
       formData,
        {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: '1acfb70a66acadebb502',
          pinata_secret_api_key: '12dfc3782fd24a25eeead27e8fa559b66416c63ff0e852d476b5802fee3bb924',
        }
      });
    return res
}
