//https://api.kucoin.com/api/v1/prices?currencies=BCH
const binance_url = "https://api.kucoin.com/api/v1/prices?currencies=BCH";

async function fetchBCHUSDTPrice() {
	const response = await fetch(binance_url);
	const api_data = await response.json();
	const price = Math.round(api_data.data.BCH * 100) / 100;
	return price;
}

async function updateBCHUSDTValue() {
	const price = await fetchBCHUSDTPrice();
	document.getElementById(
		"bch-kucoin-price"
	).textContent = `BCHUSD: ${price}`;
}

updateBCHUSDTValue();

var intervalID = setInterval(myCallback, 15000); //15 segundos

async function myCallback() {
	updateBCHUSDTValue();
	//console.log("updated");
}

//https://api.cambiocuba.money/api/v1/x-rates?date_from=2022-09-10%2000:00:00&date_to=2022-09-11%2023:59:59&offer=Venta
const cambiocuba_url =
	"https://api.cambiocuba.money/api/v1/x-rates?token=aCY78gC3kWRv1pR7VfgSlg";

async function fetchUSDTCUPPrice() {
	const response = await fetch(cambiocuba_url);
	const api_data = await response.json();
	//console.log(api_data);
	const price_usdt =
		Math.round(api_data.statistics.USDT_TRC20.avg * 100) / 100;
	const price_usd = Math.round(api_data.statistics.USD.avg * 100) / 100;
	return { price_usdt, price_usd };
}

async function updateUSDTCUPValue(autoUpdate) {
	const { price_usdt, price_usd } = await fetchUSDTCUPPrice();

	if (autoUpdate) {
		document.getElementById("usdt_cup_value").value = price_usdt;
	}

	document.getElementById(
		"usd-eltoque-price"
	).textContent = `USDCUP: ${price_usd}`;
}

var autoUpdateUSDTCUPvalue = true;

const _conf = JSON.parse(localStorage.getItem("usdt_cup_value"));
if (_conf && !_conf?.auto) {
	document.getElementById("usdt_cup_value").removeAttribute("disabled");
	autoUpdateUSDTCUPvalue = false;
	document.getElementById("USDTCUP_checkbox").checked = false;
	document.getElementById("usdt_cup_value").value = _conf.value;

	updateUSDTCUPValue(autoUpdateUSDTCUPvalue);
} else {
	updateUSDTCUPValue(autoUpdateUSDTCUPvalue);
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
			updateUSDTCUPValue(autoUpdateUSDTCUPvalue);

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

		const usdt_en_cup_a_cobrar =
			Math.round(usdt_a_cobrar * usdt_cup_value * 100) / 100;
		document.getElementById("usd_cup_a_cobrar").innerText =
			usdt_en_cup_a_cobrar + " cup";
	},
	false
);
