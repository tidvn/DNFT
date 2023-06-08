# NFT Creater tool
## Features of this Tool:
- Allow non-tech user to create their own NFT/Token by using their wallets, Fast and easy to use :) 
- Support multiple wallets
- You control your Policy ID of your assests (NFT/Token)
- Very low fee compare to other applications
- Open Source :) You could clone our application and contribute more features. we are happy to support
## Sample site:
We run a sample site at  http://nft.easterntownhall.com:8088/ 
You can mint NFT on Mainnet/Prepod directly from this site

# How to run the container:
## How to build:
you can clone codes in this repo and build your own docker image.
or pull  image by this command
```
docker pull tienna/cardano_nft
```
check the image with this command
```
cardano#:~/tmp$ sudo docker image  ls
REPOSITORY     TAG           IMAGE ID       CREATED         SIZE
postgres       latest        bf700010ce28   5 weeks ago     379MB
tidvn/dnft     latest        386ef0f129fa   6 weeks ago     210MB
python         3.8.12        52bb9574949f   15 months ago   909MB
postgres       14.1-alpine   1149d285a5f5   17 months ago   209MB
```
## How to run:
Prerequisite: 
You need to have: your wallet address in mainnet, Prepod and API key/Secret key before running the container

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

# Acknowledgement
Thank https://meshjs.dev/ for your browser wallet module. 
