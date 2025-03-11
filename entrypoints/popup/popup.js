const video = document.createElement("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true});
const scan_content = document.getElementById("scan_content");
const link_btn = document.getElementById("link_btn");
const scan_restart_btn = document.getElementById("scan_restart_btn");
const cam_status = document.getElementById("cam_status");
const copy_btn = document.getElementById("copy_btn");
const copy_tooltip = document.getElementById("copy_tooltip");
let QR;
let QRData;

//言語ファイルに格納されている文字列を取得
function getMessage(msg) {
	let getMsg = chrome.i18n.getMessage(msg);
	console.log(`msg: "${msg}" \ngetMsg: "${getMsg}"`);
	return getMsg;
}

//cam_statusに「カメラにアクセス中です・・・」を表示させる
cam_status.innerText = getMessage("popup_cam_status_access_cam");
//copy_tooltipに「QRコードの内容をコピー」を表示させる
copy_tooltip.innerText = getMessage("popup_copy_tooltip_contents_copy");

//カメラの権限を要求
navigator.mediaDevices.getUserMedia({video: true})
	.then(stream => {
		//カメラの権限が取得できたらこっち
		console.log("カメラへのアクセスが許可されました。\nCamera access granted.");
		video.srcObject = stream;
		video.play();
		console.log("QRの読み込みを開始します。\nStart reading QR.");
		//cam_statusに「カメラを起動中です・・・」を表示させる
		cam_status.innerText = getMessage("popup_cam_status_launch_cam");
		//QRコードの読み込み開始
		startQR();
	})
	.catch(e => {
		//カメラの権限が取得できなかったらこっち
		console.log(`カメラへのアクセスがブロックされました。\nCamera access blocked.\n${e}`);
		//cam_statusに「カメラにアクセスできません」を表示させる
		cam_status.innerText = getMessage("popup_cam_status_can_not_access_cam");

		navigator.permissions.query({name:'camera'}).then((result)=>{
			console.log(result.state)
			if (result.state == "prompt") {
				cam_status.innerText = getMessage("popup_cam_status_permission_req");
				setTimeout(() => {
					window.open(browser.runtime.getURL("/permissions.html"));
				}, 2000);
			}else if (result.state == "denied") {
				cam_status.innerText = getMessage("popup_cam_status_no_cam_permission");
			}else {
				cam_status.innerText = `${getMessage("popup_cam_status_unexpected_error")} \n${e}`;
			}
		});
	});

function startQR() {
	if(video.readyState === video.HAVE_ENOUGH_DATA){
		canvas.height = video.videoHeight;
		canvas.width = video.videoWidth;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
		QR = jsQR(img.data, img.width, img.height, {inversionAttempts: "dontInvert"});
		//QRを認識できたら
		if(QR){
			//読み込んだQRの内容
			console.log(QR);
			const decode_QRData = new TextDecoder("shift-jis").decode(Uint8Array.from(QR.binaryData).buffer);
			//UTF-8
			if (QR.data) {
				//認識したQRの外枠に線を引く
				//メッセージに取得したurlに変える
				console.log(`QRを検出しました\nQR detected.\nUTF-8_QRdata:"${QR.data}"`);
				urlOpen(QR.data);
			//shift-jis
			}else if (decode_QRData) {
				//認識したQRの外枠に線を引く
				console.log(`QRを検出しました\nQR detected.\nshift-jis_QRdata:"${decode_QRData}"`);
				urlOpen(decode_QRData);
			}else {
				console.log("誤検出が発生\nFalse positives occur");
				startQR();
			}
			return;
		}else{
			//cam_statusに「検出中・・・」を表示させる
			cam_status.innerText = getMessage("popup_cam_status_detecting");
		}
	}
	setTimeout(startQR, 1);
}

function urlOpen(QRData) {
	drawRect(QR.location);
	//もう一度検出する用のボタン出現
	scan_restart_btn.style.visibility = "visible";
	scan_content.innerText = QRData;
	//httpsURLかhttpURLか文字列を正規表現で検出
	if (RegExp("^https://").test(QRData)) {
		console.log("httpsのurlを検出しました。\nDetected https url.");
		//cam_statusに「URLが検出されました」を表示させる
		cam_status.innerText = getMessage("popup_cam_status_url_detected");
		//リンクのボタンを検出したURLに置き換え
		link_btn.setAttribute("href", QRData);
		//リンクのボタンのアニメーションができるように
		link_btn.classList.add("link_btn-enabled");

	}else if (RegExp("^http://").test(QRData)) {
		console.log("httpのurlを検出しました。\nDetected http url.");
		//cam_statusに「http URLが検出されました」を表示させる
		cam_status.innerText = getMessage("popup_cam_status_http_url_detected");
		link_btn.setAttribute("href", QRData);
		link_btn.classList.add("link_btn-enabled");

	}else {
		//cam_statusに「テキストが検出されました」を表示させる
		cam_status.innerText = getMessage("popup_cam_status_text_detected");
		console.log("URL以外の文字列を検出しました。\nDetected a string other than url.");
	}
}

scan_restart_btn.addEventListener("click", () => {
	link_btn.removeAttribute("href");
	link_btn.classList.remove("link_btn-enabled");
	scan_restart_btn.style.visibility = "hidden";
	scan_content.innerText = " ";
	console.log("QRの読み込みを再開します。\nRestart reading QR.");
	startQR();
});

copy_btn.addEventListener("click", () => {
	if(scan_content.textContent != " "){
		navigator.clipboard.writeText(scan_content.textContent);
		console.log("コピーしました。\nCopied");
		////copy_tooltipに「コピーしました！」を表示させる
		copy_tooltip.innerText = getMessage("popup_copy_tooltip_contents_copied");
		copy_tooltip.classList.add("tooltip_desc-enabled");
		setTimeout(()=>{
			copy_tooltip.classList.remove("tooltip_desc-enabled");
			//copy_tooltipに「QRコードの内容をコピー」を表示させる
			copy_tooltip.innerText = getMessage("popup_copy_tooltip_contents_copy");
		}, 2000);
	}
});

//検出したQRコードに枠を作る
function drawRect(location){
	drawLine(location.topLeftCorner, location.topRightCorner);
	drawLine(location.topRightCorner, location.bottomRightCorner);
	drawLine(location.bottomRightCorner, location.bottomLeftCorner);
	drawLine(location.bottomLeftCorner, location.topLeftCorner);
}

function drawLine(begin, end){
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#FF3B58";
	ctx.beginPath();
	ctx.moveTo(begin.x, begin.y);
	ctx.lineTo(end.x, end.y);
	ctx.stroke();
}
