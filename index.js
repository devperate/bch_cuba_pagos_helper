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
	bch_usd_price = price;
	document.getElementById(
		"bch-kucoin-price"
	).textContent = `BCHUSD: ${price}`;
}

updateBCHUSDTValue();

var intervalID = setInterval(myCallback, 15000); //15 segundos

async function myCallback() {
	updateBCHUSDTValue();
	fetchBCHUSDPrice();
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

const bch_usd_price_api = "https://api.fullstack.cash/v5/price/usd";
var bch_usd_price = 0;

async function fetchBCHUSDPrice() {
	const response = await fetch(bch_usd_price_api);
	const api_data = await response.json();
	const price = Math.round(api_data.usd * 100) / 100;
	bch_usd_price = price;
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

document
	.getElementById("calcular")
	.addEventListener("click", calcularCobro, false);

function calcularCobro() {
	const usdt_cup_value = Number(
		document.getElementById("usdt_cup_value").value
	);
	const descuento = Number(document.getElementById("descuento").value) / 100;
	const cup_a_cobrar = Number(document.getElementById("cup_a_cobrar").value);

	if (!!!cup_a_cobrar || cup_a_cobrar <= 0) {
		showToast("Cantidad a cobrar invalida");
		return;
	}
	if (!!!usdt_cup_value || usdt_cup_value <= 0) {
		showToast("Valor de USDT/CUP invalido");
		return;
	}

	const usdt_a_cobrar =
		cup_a_cobrar / usdt_cup_value -
		(cup_a_cobrar / usdt_cup_value) * descuento;
	document.getElementById("usdt_a_cobrar").value =
		Math.round(usdt_a_cobrar * 100) / 100;

	const usdt_en_cup_a_cobrar =
		Math.round(usdt_a_cobrar * usdt_cup_value * 100) / 100;
	document.getElementById("usd_cup_a_cobrar").innerText =
		usdt_en_cup_a_cobrar + " cup";
}

const bch_wallet = new SlpWallet();
const bchjs = bch_wallet.bchjs;

var address_type = localStorage.getItem("address_type");

async function validateBchRecipientAddress() {
	const bch_recipient_address = document.getElementById(
		"bch_recipient_address"
	).value;
	const bch_recipient_address_element = document.getElementById(
		"bch_recipient_address"
	);

	if (!!bch_recipient_address) {
		const is_valid = await bchjs.Util.validateAddress(
			bch_recipient_address
		);
		//console.log(is_valid);
		if (is_valid.isvalid) {
			localStorage.setItem(
				"bch_recipient_address",
				bch_recipient_address
			);
			localStorage.setItem("address_type", address_type);

			address_type = bchjs.Address.isCashAddress(bch_recipient_address)
				? "cash"
				: "legacy";
			document
				.getElementById("cash_legacy_swapper_btn")
				.setAttribute(
					"data-address-type",
					address_type === "legacy" ? "cash" : "legacy"
				);
			document.getElementById(
				"cash_legacy_swapper_btn"
			).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
						</svg>${address_type === "legacy" ? "Cash Address" : "Legacy Address"}`;

			const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
			shaObj.update(bch_recipient_address);
			const hash_bch_recipient_address = shaObj.getHash("HEX");
			localStorage.setItem(
				"bch_recipient_address_sha256sums",
				hash_bch_recipient_address
			);

			document
				.querySelector("#bch_recipient_address")
				.classList.add("is-valid");
			document
				.querySelector("#bch_recipient_address")
				.classList.remove("is-invalid");
			document
				.querySelector("#feedback_div_label_bch_recipient_address")
				.setAttribute("hidden", "true");
			textAreaAdjust(bch_recipient_address_element);

			document
				.getElementById("address_type_for_address_input")
				.removeAttribute("hidden");
			document.getElementById(
				"address_type_for_address_input"
			).innerHTML = address_type + " address";
		} else {
			document
				.querySelector("#bch_recipient_address")
				.classList.remove("is-valid");
			document
				.querySelector("#bch_recipient_address")
				.classList.add("is-invalid");
			document
				.querySelector("#feedback_div_label_bch_recipient_address")
				.removeAttribute("hidden");
			textAreaAdjust(bch_recipient_address_element);

			document
				.getElementById("address_type_for_address_input")
				.setAttribute("hidden", "true");
		}
	} else {
		localStorage.removeItem("bch_recipient_address");
		localStorage.removeItem("address_type");

		document
			.querySelector("#bch_recipient_address")
			.classList.remove("is-valid");
		document
			.querySelector("#bch_recipient_address")
			.classList.add("is-invalid");
		document
			.querySelector("#feedback_div_label_bch_recipient_address")
			.removeAttribute("hidden");
		textAreaAdjust(bch_recipient_address_element);

		document
			.getElementById("address_type_for_address_input")
			.setAttribute("hidden", "true");
	}
}

function textAreaAdjust(element) {
	element.style.height = "1px";
	element.style.height = 25 + element.scrollHeight + "px";
}

document
	.getElementById("wallet_name")
	.addEventListener("change", setWalletName);
document
	.getElementById("wallet_name_button")
	.addEventListener("click", setWalletName);
function setWalletName() {
	localStorage.setItem(
		"wallet_name",
		document.getElementById("wallet_name").value
	);
}
const wallet_name = localStorage.getItem("wallet_name");
if (!!wallet_name) {
	document.getElementById("wallet_name").value = wallet_name;
}

document
	.getElementById("bch_recipient_address")
	.addEventListener("change", validateBchRecipientAddress);

let timer_input;
document
	.getElementById("bch_recipient_address")
	.addEventListener("input", () => {
		document
			.querySelector("#bch_recipient_address")
			.classList.remove("is-valid", "is-invalid");
		document
			.querySelector("#feedback_div_label_bch_recipient_address")
			.setAttribute("hidden", "true");

		textAreaAdjust(document.getElementById("bch_recipient_address"));

		document
			.getElementById("address_type_for_address_input")
			.removeAttribute("hidden");
		document.getElementById("address_type_for_address_input").innerHTML =
			'<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

		clearTimeout(timer_input);
		timer_input = null;

		if (!timer_input) {
			timer_input = setTimeout(validateBchRecipientAddress, 1995);
		}
	});

document
	.getElementById("validate_bch_recipient_address_button")
	.addEventListener("click", validateBchRecipientAddress);

const bch_recipient_address_value = localStorage.getItem(
	"bch_recipient_address"
);
if (!!bch_recipient_address_value) {
	//console.log(bch_recipient_address_value);
	document.getElementById("bch_recipient_address").value =
		bch_recipient_address_value;
	validateBchRecipientAddress();
}

document
	.getElementById("qr-cobrar")
	.addEventListener("click", async function () {
		calcularCobro();
		validateQrGeneration(address_type === "legacy" ? 0 : 1);
	});

var offcanvas_showing = "";

function validateQrGeneration(legacy = 0) {
	const usd_a_cobrar = document.getElementById("usdt_a_cobrar").value;
	let amount_ok = false;
	if (!!usd_a_cobrar && usd_a_cobrar > 0) {
		amount_ok = true;
	} else {
		document.getElementById("qr-offcanvas-close").click();
		showToast("Cantidad a cobrar invalida");
		return;
	}

	const bch_recipient_address_input = document.getElementById(
		"bch_recipient_address"
	).value;
	const bch_recipient_address_LS = localStorage.getItem(
		"bch_recipient_address"
	);
	const bch_recipient_address_sha256sums = localStorage.getItem(
		"bch_recipient_address_sha256sums"
	);

	const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
	shaObj.update(bch_recipient_address_input);
	const hash_bch_recipient_address_input = shaObj.getHash("HEX");

	if (
		bch_recipient_address_LS === bch_recipient_address_input &&
		hash_bch_recipient_address_input === bch_recipient_address_sha256sums &&
		!!bch_recipient_address_LS &&
		amount_ok
	) {
		const offcanvas_payment = new bootstrap.Offcanvas("#offcanvasTop");
		offcanvas_payment.show();

		const amount = usd_a_cobrar / bch_usd_price;
		//console.log(Math.round(amount * 100000000));

		if (
			address_type === "cash" &&
			bch_recipient_address_input.split(":").length == 1
		) {
			generateQrCode(
				getCashLegacyAddresses(
					"bitcoincash:" + bch_recipient_address_input
				)[legacy],
				Math.round(amount * 100000000) / 100000000
			);
		} else {
			generateQrCode(
				getCashLegacyAddresses(bch_recipient_address_input)[legacy],
				Math.round(amount * 100000000) / 100000000
			);
		}
	} else {
		showToast("Revise la direccion de destino en la configuracion");
	}
}

function getCashLegacyAddresses(address) {
	if (bchjs.Address.isCashAddress(address)) {
		return [bchjs.Address.toLegacyAddress(address), address];
	} else {
		return [address, bchjs.Address.toCashAddress(address)];
	}
}

document
	.getElementById("cash_legacy_swapper_btn")
	.addEventListener("click", async function () {
		const data_address_type = this.getAttribute("data-address-type");
		await resetPaymentScreen();
		validateQrGeneration(data_address_type === "legacy" ? 0 : 1);
		this.setAttribute(
			"data-address-type",
			data_address_type === "legacy" ? "cash" : "legacy"
		);

		this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
						</svg>${data_address_type === "legacy" ? "Cash Address" : "Legacy Address"}`;
	});

document
	.getElementById("qr-offcanvas-close")
	.addEventListener("click", async function () {
		await resetPaymentScreen();
	});
document
	.getElementById("listo_pago_recibido_btn")
	.addEventListener("click", async function () {
		await resetPaymentScreen();
	});
async function resetPaymentScreen() {
	document.getElementById(
		"canvas-qr"
	).innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><h6>Generando QR!</h6>`;

	clearInterval(timer);
	timer = null;
	document.getElementById("countdown_timer").innerHTML = "10:00";

	document.getElementById("values_to_pay_info_text").innerHTML = "";
	document
		.getElementById("div_pago_completado")
		.setAttribute("hidden", "true");
	document.getElementById("div_pago_qr").removeAttribute("hidden");

	await electrum.disconnect();
}

async function generateQrCode(bch_recipient_address, amount) {
	let screen_size = 300;
	if (window.innerWidth < window.innerHeight) {
		screen_size = window.innerWidth - window.innerWidth * 0.35;
	} else {
		screen_size = window.innerHeight - window.innerHeight * 0.35;
	}
	//console.log(bch_recipient_address);
	const color_scheme = localStorage.getItem("bs.prefers-color-scheme");
	const qrCode = new QRCodeStyling({
		width: screen_size,
		height: screen_size,
		type: "svg",
		data: bch_recipient_address + `?amount=` + amount,
		image: "media/bitcoin-cash-cuba.png",
		imageOptions: {
			hideBackgroundDots: false,
		},
		cornersDotOptions: {
			type: "dot",
		},
		cornersSquareOptions: {
			type: "extra-rounded",
		},
		dotsOptions: {
			color: color_scheme == "light" ? "#2f2f2f" : "#fff",
			type: "extra-rounded",
		},
		backgroundOptions: {
			color: color_scheme == "light" ? "#fff" : "#2f2f2f",
		},
	});

	//const rawSVG = await qrCode.getRawData("svg");
	/*if (!rawSVG) {
		throw new Error("Failed to get raw data for SVG.");
	}*/
	//return rawSVG;

	document.getElementById("canvas-qr").innerHTML = "";
	await qrCode.append(document.getElementById("canvas-qr"));
	document.getElementById("canvas-qr").onclick = reverseQrColor;
	document.getElementById("values_to_pay_info_text").innerHTML = `${
		document.getElementById("usdt_a_cobrar").value
	} usd - ${
		document.getElementById("usd_cup_a_cobrar").innerHTML
	} - ${amount} bch`;

	if (!timer) {
		now = new Date().getTime();
		end = now + countdown;
		timer = setInterval(updateTimer, 1000);
	}

	// Takes the address and the expected amount (in satoshis).
	watchForMatchingPayment(bch_recipient_address, amount, async () => {
		// This callback will be called when payment is received.
		// TODO: Change UI to show that the payment was received.
		//console.log("payment recieved!");
		document.getElementById("values_to_pay_info_text").innerHTML = "";
		document.getElementById("div_pago_qr").setAttribute("hidden", "true");
		document
			.getElementById("div_pago_completado")
			.removeAttribute("hidden");
		let audio = new Audio("media/Bitcoin Cash Logo SoundClip_320kbps.mp3");
		audio.play();
		await electrum.disconnect();
	});
}

function reverseQrColor() {
	const qr = document.querySelector(`#${this.getAttribute("id")}`);
	const rects = qr.querySelectorAll("rect[fill]");
	//console.log(rects[0].getAttribute('fill'));
	rects[0].setAttribute(
		"fill",
		rects[0].getAttribute("fill") == "#2f2f2f" ? "#fff" : "#2f2f2f"
	);
	rects[1].setAttribute(
		"fill",
		rects[1].getAttribute("fill") == "#2f2f2f" ? "#fff" : "#2f2f2f"
	);
}
window.reverseQrColor = reverseQrColor;

var now;
const countdown = 1000 * 60 * 10; //10 minutos
var end;

let timer;

async function updateTimer() {
	now = new Date().getTime();
	var timeleft = end - now;

	var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

	document.getElementById("countdown_timer").innerHTML =
		minutes + ":" + seconds;

	if (timeleft < 0) {
		clearInterval(timer);
		document.getElementById("countdown_timer").innerHTML = "10:00";
		document.getElementById("qr-offcanvas-close").click();
		document.getElementById("values_to_pay_info_text").innerHTML = "";

		await electrum.disconnect();
	}
}

const ElectrumClient = window.ElectrumClient;

const electrum = new ElectrumClient(
	"BCHCubaPagosHelper",
	"1.4.3",
	"bch.imaginary.cash",
	50004,
	"wss"
);

async function watchForMatchingPayment(
	address,
	expectedAmount,
	callbackWhenPaymentReceived
) {
	//console.log(expectedAmount);
	// When we initially subscribe, we will be sent a notification.
	// We want to store the list of UTXOs that already exist here so that we make sure we are only checking for NEW UTXOs by filtering later.
	const processedUnspents = new Set();

	// Wait for the client to connect
	await electrum.connect();

	// Subscribe to the address.
	await electrum.subscribe(
		async (payload) => {
			// Get a list of unspent outputs on the receiving address.
			const unspents = await electrum.request(
				"blockchain.address.listunspent",
				address
			);

			// If the payload received is not an array, something has gone wrong.
			if (!Array.isArray(unspents)) {
				throw new Error(
					`Failed to make call to blockchain.address.listunpent on ${address}`
				);
			}

			// Electrum quirk: When we first call subscribe, it will trigger this callback. However, it will NOT return an array.
			// So we don't pick up on the last UTXO before this payment was requested, we check the payload and ignore it if it is not an array.
			if (!Array.isArray(payload)) {
				// Add the initial list of unspents to our list of processed UTXOs.
				unspents.forEach((unspent) =>
					processedUnspents.add(unspent.tx_hash)
				);

				// Return to prevent further execution.
				return;
			}

			// Filter out unspents that have been processed already by checking our processed unspents list.
			const unprocessedUnspents = unspents.filter(
				(unspent) => !processedUnspents.has(unspent.tx_hash)
			);

			// Iterate through each of the unprocessed unspents and check if any match our expected amount.
			for (const unprocessedUnspent of unprocessedUnspents) {
				//console.log(unprocessedUnspent);
				if (unprocessedUnspent.value === expectedAmount * 100000000) {
					callbackWhenPaymentReceived();
				} else {
					console.log(
						`Ignoring unspent ${unprocessedUnspent.tx_hash} as it does not match our expected value`
					);
				}
			}
		},
		"blockchain.address.subscribe",
		address
	);
}

const off_canvas_start = document.getElementById("offcanvasStart");
off_canvas_start.addEventListener("shown.bs.offcanvas", (event) => {
	document.getElementById("pin_2").focus();
});

document.getElementById("settings_btn").addEventListener("click", function () {
	const s_offcanvas = new bootstrap.Offcanvas("#offcanvasStart");
	s_offcanvas.show();
	offcanvas_showing = s_offcanvas;

	const HPIN = localStorage.getItem("hash_pin");
	if (!!HPIN) {
		document.getElementById("pin_btn").removeAttribute("disabled");
		document
			.querySelector("#insert_pin_form")
			.setAttribute("hidden", "true");
		document.getElementById("check_pin_form").removeAttribute("hidden");
	}
});

document.getElementById("pin_0").addEventListener("input", function () {
	validatePin();
});
document.getElementById("pin_1").addEventListener("input", function () {
	validatePin();
});
document.getElementById("replace_pin_0").addEventListener("input", function () {
	validatePin("replace_");
});
document.getElementById("replace_pin_1").addEventListener("input", function () {
	validatePin("replace_");
});

function validatePin(pin_key = "") {
	const pin_0 = document.getElementById(pin_key + "pin_0").value;
	const pin_1 = document.getElementById(pin_key + "pin_1").value;

	check4StrongPin(pin_0, pin_1);

	if (pin_0 !== pin_1) {
		document.getElementById(pin_key + "pin_1").classList.remove("is-valid");
		document.getElementById(pin_key + "pin_1").classList.add("is-invalid");

		document
			.getElementById(pin_key + "pin_btn")
			.setAttribute("disabled", "true");
	} else {
		document
			.getElementById(pin_key + "pin_1")
			.classList.remove("is-invalid");
		document.getElementById(pin_key + "pin_1").classList.add("is-valid");

		document
			.getElementById(pin_key + "pin_btn")
			.removeAttribute("disabled");
	}
}

function check4StrongPin(pin_0, pin_1) {
	const pass = pin_0 || pin_1;
	//console.log(window.passwordStrength(pass));
	switch (window.passwordStrength(pass).id) {
		case 0:
			document.querySelector("#pass_strength > div").className =
				"progress-bar bg-danger";
			document.querySelector("#pass_strength > div").style.width = "10%";
			break;
		case 1:
			document.querySelector("#pass_strength > div").className =
				"progress-bar bg-warning";
			document.querySelector("#pass_strength > div").style.width = "35%";
			break;
		case 2:
			document.querySelector("#pass_strength > div").className =
				"progress-bar bg-info";
			document.querySelector("#pass_strength > div").style.width = "71%";
			break;
		case 3:
			document.querySelector("#pass_strength > div").className =
				"progress-bar bg-success";
			document.querySelector("#pass_strength > div").style.width = "100%";
			break;
		default:
			document.querySelector("#pass_strength > div").className =
				"progress-bar bg-danger";
			document.querySelector("#pass_strength > div").style.width = "1%";
	}
}

document
	.getElementById("settings_close_btn")
	.addEventListener("click", function () {
		document.getElementById("replace_pin_0").value = "";
		document.getElementById("replace_pin_1").value = "";
		document.getElementById("replace_pin_1").classList.add("is-invalid");

		offcanvas_showing.hide();
	});

document.getElementById("pin_btn").addEventListener("click", function () {
	setCheckPIN();
});

document
	.getElementById("replace_pin_btn")
	.addEventListener("click", function () {
		setCheckPIN("replace_");
	});

function showToast(text) {
	document.getElementById("text-toast").innerHTML = text;
	const toast = new bootstrap.Toast(document.getElementById("liveToast"));
	toast.show();
}

function setCheckPIN(pin_key = "") {
	const HPIN = localStorage.getItem("hash_pin");

	if (!!!HPIN || pin_key === "replace_") {
		const pin_0 = document.getElementById(pin_key + "pin_0").value;
		const pin_1 = document.getElementById(pin_key + "pin_1").value;

		if (pin_0 === pin_1) {
			const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
			shaObj.update(pin_0);
			const hash_pass = shaObj.getHash("HEX");

			localStorage.setItem("hash_pin", hash_pass);
			showToast("Se ha guardado el nuevo PIN!");
			if (pin_key != "replace_") {
				offcanvas_showing.hide();
				const r_offcanvas = new bootstrap.Offcanvas("#offcanvasRight");
				r_offcanvas.show();
				offcanvas_showing = r_offcanvas;
			} else {
				showToast("Se ha actualizado el PIN!");
			}
		}
	} else {
		const pin = document.getElementById("pin_2").value;

		const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
		shaObj.update(pin);
		const hash_pass = shaObj.getHash("HEX");

		if (HPIN === hash_pass) {
			document.getElementById("pin_2").value = "";
			document.getElementById("pin_2").classList.remove("is-invalid");

			offcanvas_showing.hide();
			const r_offcanvas = new bootstrap.Offcanvas("#offcanvasRight");
			r_offcanvas.show();
			offcanvas_showing = r_offcanvas;
		} else {
			document.getElementById("pin_2").classList.add("is-invalid");
		}
	}
}

document
	.getElementById("pin_auth_offcanvas")
	.addEventListener("click", function () {
		document.getElementById("pin_2").value = "";
	});

const nav_link_el = document.querySelectorAll(".nav-link");
nav_link_el.forEach((el) => {
	el.addEventListener("click", function () {
		nav_link_el.forEach((elem) => {
			elem.classList.remove("active");
			document.querySelector(elem.hash).classList.remove("show");
		});

		el.classList.add("active");
	});
});
