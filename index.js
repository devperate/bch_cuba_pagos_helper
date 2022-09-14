//https://api.binance.com/api/v3/ticker/price?symbol=BCHUSDT
const binance_url =
	"https://api.binance.com/api/v3/ticker/price?symbol=BCHUSDT";

async function fetchBCHUSDTPrice() {
	const response = await fetch(binance_url);
	const api_data = await response.json();
	const price = Math.round(api_data.price * 100) / 100;
	return price;
}

async function updateBCHUSDTValue() {
	const price = await fetchBCHUSDTPrice();
	document.getElementById(
		"bch-binance-price"
	).textContent = `BCHUSDT - ${price}`;
}

updateBCHUSDTValue();

var intervalID = setInterval(myCallback, 15000); //15 segundos

async function myCallback() {
	updateBCHUSDTValue();
	//console.log("updated");
}

//https://api.cambiocuba.money/api/v1/x-rates?date_from=2022-09-10%2000:00:00&date_to=2022-09-11%2023:59:59&offer=Venta
const cambiocuba_url =
	"https://api.cambiocuba.money/api/v1/x-rates?offer=Venta";

async function fetchUSDTCUPPrice() {
	const response = await fetch(cambiocuba_url);
	const api_data = await response.json();
	//console.log(api_data);
	const price = Math.round(api_data.statistics.USDT_TRC20.avg * 100) / 100;
	return price;
}

async function updateUSDTCUPValue() {
	const price = await fetchUSDTCUPPrice();
	document.getElementById("usdt_cup_value").value = price;
}

updateUSDTCUPValue();

var intervalID1 = setInterval(myCallback1, 60000 * 15); //15 minutos
var autoUpdateUSDTCUPvalue = true;

async function myCallback1() {
	if (autoUpdateUSDTCUPvalue) updateUSDTCUPValue();
	//console.log("updated");
}

document.getElementById("USDTCUP_checkbox").addEventListener(
	"click",
	function () {
		if (
			document.getElementById("usdt_cup_value").hasAttribute("disabled")
		) {
			document
				.getElementById("usdt_cup_value")
				.removeAttribute("disabled");
			autoUpdateUSDTCUPvalue = false;
		} else {
			document
				.getElementById("usdt_cup_value")
				.setAttribute("disabled", "");
			autoUpdateUSDTCUPvalue = true;
			updateUSDTCUPValue();
		}
	},
	false
);

document.getElementById("calcular").addEventListener(
	"click",
	function () {
		console.log("asd");
		const usdt_cup_value = Number(
			document.getElementById("usdt_cup_value").value
		);
		const descuento =
			Number(document.getElementById("descuento").value) / 100;
		const cup_a_cobrar = Number(
			document.getElementById("cup_a_cobrar").value
		);

		const usdt_a_cobrar =
			cup_a_cobrar / usdt_cup_value -
			(cup_a_cobrar / usdt_cup_value) * descuento;
		document.getElementById("usdt_a_cobrar").value =
			Math.round(usdt_a_cobrar * 100) / 100;
	},
	false
);
