# NFT Creater tool
## Features of this Tool:
- Allow non-tech user to create their own NFT/Token by using their wallets, Fast and easy to use :) 
- Support multiple wallets
- You control your Policy ID of your assests (NFT/Token)
- Very low fee compare to other applications
- Open Source :) You could clone our application and contribute more features. we are happy to support
# How to run the container:
## Syntax:
``` bash
sudo docker run -d -t -i -e AUTHOR='cardano2vn.io' \
 -e MAINNET_ADDR='addr1_on_main_net' \
 -e PREPROD_ADDR='addr_test1_on_Prepod' \
 -e PINATA_API_KEY='Put your IPFS_API_KEY_HERE' \
 -e PINATA_SECRET_API_KEY='Put_your_IPFS_API_SCRET_KEY_HERE' \
 -p 8088:3025 \
 --name tnft tidvn/dnft
```
## If you need support:
Please contact Dung or Tien at https://t.me/cardano2vn 

## Acknowledgement
Thank https://meshjs.dev/ for your browser wallet module. 
