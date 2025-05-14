const { ethers } = require("ethers");
const chalk = require("chalk");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const provider = new ethers.JsonRpcProvider(process.env.RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const ROUTER_ABI = [
  "function exactInputSingle((address,address,uint24,address,uint256,uint256,uint160)) external payable returns (uint256)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)"
];

const contracts = {
  router: process.env.ROUTER,
  usdt: process.env.USDT,
  btc: process.env.BTC,
  eth: process.env.ETH,
};

const routes = [
  { from: "usdt", to: "btc", amount: ethers.utils.parseUnits("10", 18) },  // 10 USDT
  { from: "usdt", to: "eth", amount: ethers.utils.parseUnits("10", 18) },   // 10 USDT
  { from: "eth", to: "usdt", amount: ethers.utils.parseUnits("0.01", 18) }, // 0.01 ETH
  { from: "eth", to: "btc", amount: ethers.utils.parseUnits("0.01", 18) },  // 0.01 ETH
  { from: "btc", to: "usdt", amount: ethers.utils.parseUnits("0.001", 18) }, // 0.001 BTC
  { from: "btc", to: "eth", amount: ethers.utils.parseUnits("0.001", 18) },  // 0.001 BTC
];

const router = new ethers.Contract(contracts.router, ROUTER_ABI, wallet);

console.log(chalk.cyanBright(`
███████╗ █████╗ ██╗     ███████╗██╗     ██╗███████╗ ██████╗ 
██╔════╝██╔══██╗██║     ██╔════╝██║     ██║██╔════╝██╔═══██╗
███████╗███████║██║     █████╗  ██║     ██║█████╗  ██║   ██║
╚════██║██╔══██║██║     ██╔══╝  ██║     ██║██╔══╝  ██║   ██║
███████║██║  ██║███████╗███████╗███████╗██║███████╗╚██████╔╝
╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝╚══════╝ ╚═════╝ 
                    Galelio V3
               owner : t.me/didinska
`));

async function approveIfNeeded(tokenAddress, amount) {
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
  const balance = await token.balanceOf(wallet.address);
  if (balance.lt(amount)) {
    console.log(chalk.yellow(`[SKIP] Insufficient balance for approval of ${amount.toString()} tokens`));
    return false;
  }
  const tx = await token.approve(contracts.router, amount);
  await tx.wait();
  return true;
}

async function swap(from, to, amount) {
  const tokenIn = new ethers.Contract(contracts[from], ERC20_ABI, wallet);
  const tokenOut = contracts[to];
  const decimals = await tokenIn.decimals();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

  if (amount.eq(0)) {
    console.log(chalk.yellow(`[SKIP] No balance for ${from.toUpperCase()} => ${to.toUpperCase()}`));
    return;
  }

  // Approve if needed
  const approved = await approveIfNeeded(contracts[from], amount);
  if (!approved) return;

  const params = {
    tokenIn: contracts[from],
    tokenOut,
    fee: 3000,
    recipient: wallet.address,
    deadline,
    amountIn: amount,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const tx = await router.exactInputSingle(params, { gasLimit: 300000 });
      const receipt = await tx.wait();
      console.log(chalk.green(`[SUCCESS] ${from.toUpperCase()} => ${to.toUpperCase()} | Amount: ${ethers.utils.formatUnits(amount, decimals)} | Hash: ${receipt.hash}`));
      break;
    } catch (err) {
      console.log(chalk.red(`[FAILED] ${from.toUpperCase()} => ${to.toUpperCase()} | Attempt ${attempt} | ${err.reason || err.message}`));
      if (attempt === 3) {
        console.log(chalk.red(`[SKIP] Max retries reached for ${from.toUpperCase()} => ${to.toUpperCase()}`));
      }
    }
  }
}

rl.question(chalk.blue("Input jumlah transaksi: "), async (count) => {
  const jumlah = parseInt(count);
  console.log(chalk.magenta(`\nMulai kirim ${jumlah} transaksi...\n`));

  for (let i = 0; i < jumlah; i++) {
    console.log(chalk.yellow(`\n[TX ROUND ${i + 1}]`));
    for (const route of routes) {
      await swap(route.from, route.to, route.amount);
    }
  }

  console.log(chalk.green("\nSemua transaksi selesai!"));
  rl.close();
});
