const bip39 = require('bip39')
const ethwallet = require("ethereumjs-wallet")
const hdkey = require('ethereumjs-wallet/hdkey')

const DEFAULT_PATH = "m/44'/60'/0'/24"

let generate = path => {
    let mnemonic = bip39.generateMnemonic()
    let seed = bip39.mnemonicToSeed(mnemonic)
    path = path || DEFAULT_PATH
    let hdwallet = hdkey.fromMasterSeed(seed)
    let wallet = hdwallet.derivePath(path).getWallet()
    let pubkey = "0x" + wallet.getPublicKey().toString("hex")
	  let prikey = wallet.getPrivateKey().toString("hex")
    let checkedsum = wallet.getChecksumAddressString()
    let address = checkedsum.toLowerCase()
		return {mnemonic,path,prikey,address,checkedsum}
}


const express = require("express")
let  app = express();
const bodyParser = require("body-parser")



//设置跨与访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.use(bodyParser.json())

app.get("/", (req, res) => {
  let	account = generate()
  res.send(
  `
	助记词：${account.mnemonic}
	衍生路径： ${account.path}
	私钥：${account.prikey}
	普通地址：${account.address}
	校验地址：${account.checkedsum}

  助记词+衍生路径 相当于 私钥,请妥善保存

	`) 
})

app.listen(3333)
console.log("Ethereum Account Generateor listening on 3333")
