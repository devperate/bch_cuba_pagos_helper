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
	).textContent = `BCHUSDT: ${price}`;
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

var autoUpdateUSDTCUPvalue = true;

const _conf = JSON.parse(localStorage.getItem("usdt_cup_value"));
if (!_conf.auto) {
	document.getElementById("usdt_cup_value").removeAttribute("disabled");
	autoUpdateUSDTCUPvalue = false;
	document.getElementById("USDTCUP_checkbox").checked = false;
	document.getElementById("usdt_cup_value").value = _conf.value;
}else{
	updateUSDTCUPValue();
}
document.getElementById("descuento").value = localStorage.getItem("descuento");

var intervalID1 = setInterval(myCallback1, 60000 * 15); //15 minutos

async function myCallback1() {
	if (autoUpdateUSDTCUPvalue) updateUSDTCUPValue();
	//console.log("updateUSDTCUPValue updated");
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

			const usdt_cup_value =
				document.getElementById("usdt_cup_value").value;
			localStorage.setItem(
				"usdt_cup_value",
				JSON.stringify({ auto: false, value: usdt_cup_value })
			);
		} else {
			document
				.getElementById("usdt_cup_value")
				.setAttribute("disabled", "");
			autoUpdateUSDTCUPvalue = true;
			updateUSDTCUPValue();

			localStorage.setItem(
				"usdt_cup_value",
				JSON.stringify({ auto: true, value: 0 })
			);
		}
	},
	false
);

document
	.getElementById("usdt_cup_value")
	.addEventListener("change", function () {
		localStorage.setItem(
			"usdt_cup_value",
			JSON.stringify({ auto: false, value: this.value })
		);
	});

document.getElementById("descuento").addEventListener("change", function () {
	localStorage.setItem("descuento", this.value);
});

document.getElementById("calcular").addEventListener(
	"click",
	function () {		
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

		const usdt_en_cup_a_cobrar = Math.round(usdt_a_cobrar * usdt_cup_value * 100) / 100;
		document.getElementById("usd_cup_a_cobrar").innerText = usdt_en_cup_a_cobrar + " cup";
	},
	false
);
