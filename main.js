//分かりづらい変数名
const video = document.createElement("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true});
const message_info = document.getElementById("message_info");
const message = document.getElementById("message");
const link_btn = document.getElementById("link_btn");
const re_btn = document.getElementById("re_btn");
const re_btn_css = document.getElementById("re_btn_div");
const copy_btn = document.getElementById("copy_btn");
const copy_text = document.getElementById("copy_text");
let QR;

//カメラの権限を要求
navigator.mediaDevices.getUserMedia(
	{video: true}
	).then(stream => {
		//カメラの権限が取得できたらこっち
		console.log("カメラへのアクセスが許可されました。\nCamera access granted.");
		video.srcObject = stream;
		video.play();
		console.log("QRの読み込みを開始します。\nStart reading QR.");
		//QRを読み込む
		message_info.innerText = "カメラを起動中です・・・";
		startQR();
	}).catch(e => {
		//カメラの権限が取得できなかったらこっち
		console.log(`カメラへのアクセスがブロックされました。\nCamera access blocked.\n${e}`);
		console.log("どうしようもありません。\nThere is nothing we can do about it.")
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
			//認識したQRの外枠に線を引く
			drawRect(QR.location);
			message_info.innerText = QR.data;
			console.log(new TextDecoder("shift-jis").decode(Uint8Array.from(QR.binaryData).buffer))
			console.log(`QRを検出しました\nQR detected.\nQRdata:"${QR.data}"`)
			urlOpen();
			return;
		}else{
			message_info.innerText = "検出中・・・"
		}
	}
	setTimeout(startQR, 1);
}

re_btn.addEventListener("click", () => {
	link_btn.removeAttribute("href");
	link_btn.classList.remove("link_btn");
	re_btn_css.style.visibility = "hidden";
	console.log("QRの読み込みを再開します。\nRestart reading QR.");
	startQR();
});

copy_btn.addEventListener("click", () => {
	console.log("copy_button_click")
	if(QR.data){
		navigator.clipboard.writeText(QR.data);
		console.log("コピーしました。\nCopied");
		copy_text.innerText = "コピーしました。";
		setTimeout(()=>{copy_text.innerText = "";}, 2000);
	}
})

function urlOpen() {
	//httpsURLかhttpURLか文字列を正規表現で検出
	if(RegExp("^https").test(QR.data)){
		console.log("httpsのurlを検出しました。\nDetected https url.");
		//リンクのボタンを検出したURLに置き換え
		link_btn.setAttribute("href", QR.data);
		//リンクのボタンのアニメーションができるように
		link_btn.classList.add("link_btn");
		//もう一度検出する用のボタン出現
		re_btn_css.style.visibility = "visible";
	}else if(RegExp("^http").test(QR.data)){
		console.log("httpのurlを検出しました。\nDetected http url.");
		//一応念のためhttpのURLの際は警告を出す
		const httpAlert=()=>{alert("保護されていない通信:http");}
		setTimeout(httpAlert, 300)
		//info_messageの色を変更...後で変更しといて
		message.style.cssText = "background-color: #fc0; box-shadow: 1px 1px 2px red; border: 1px solid red;";
		link_btn.setAttribute("href", QR.data);
		link_btn.classList.add("link_btn");
		re_btn_css.style.visibility = "visible";
	}else if(QR.data == false){
		console.log("誤検出が発生\nFalse positives occur");
		startQR();
	}else{
		console.log("URL以外の文字列を検出しました。\nDetected a string other than url.")
		re_btn_css.style.visibility = "visible";
	}
}


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