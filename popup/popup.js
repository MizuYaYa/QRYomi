const video = document.createElement("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true});
const scan_content = document.getElementById("scan_content");
const link_btn = document.getElementById("link_btn");
const scan_restart_btn = document.getElementById("scan_restart_btn");
const cam_status = document.getElementById("cam_status");
const copy_btn = document.getElementById("copy_btn");
const copy_text = document.getElementById("copy_text");
let QR;
let QRData

//カメラの権限を要求
navigator.mediaDevices.getUserMedia({video: true})
	.then(stream => {
		//カメラの権限が取得できたらこっち
		console.log("カメラへのアクセスが許可されました。\nCamera access granted.");
		video.srcObject = stream;
		video.play();
		console.log("QRの読み込みを開始します。\nStart reading QR.");
		//QRを読み込む
		cam_status.innerText = "カメラを起動中です・・・";
		startQR();
	})
	.catch(e => {
		//カメラの権限が取得できなかったらこっち
		console.log(`カメラへのアクセスがブロックされました。\nCamera access blocked.\n${e}`);
		console.log("どうしようもありません。\nThere is nothing we can do about it.");
		cam_status.innerText = "カメラにアクセスできません";
		navigator.permissions.query({name:'camera'}).then((result)=>{
			console.log(result.state)
			if (result.state == "prompt") {
				cam_status.innerText = "権限取得のためページを開きます。";
				setTimeout(() => {
					window.open("../permissions.html");
				}, 2000);
			}else if (result.state == "denied") {
				cam_status.innerText = "カメラの権限がありません。\nchrome側のサイトの設定からカメラの権限を許可してください。";
			}else {
				cam_status.innerText = `予期せぬエラーが発生した可能性があります。\n${e}`;
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
			cam_status.innerText = "検出中・・・";
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
		cam_status.innerText = "リンクを検出しました。";
		//リンクのボタンを検出したURLに置き換え
		link_btn.setAttribute("href", QRData);
		//リンクのボタンのアニメーションができるように
		link_btn.classList.add("link_btn-enabled");

	}else if (RegExp("^http://").test(QRData)) {
		console.log("httpのurlを検出しました。\nDetected http url.");
		cam_status.innerText = "httpのリンクを検出しました。";
		//一応念のためhttpのURLの際は警告を出す
		setTimeout(()=>{alert("保護されていない通信:http")}, 300);
		link_btn.setAttribute("href", QRData);
		link_btn.classList.add("link_btn-enabled");

	}else {
		cam_status.innerText = "テキストを検出しました。";
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
		copy_text.innerText = "コピーしました。";
		setTimeout(()=>{copy_text.innerText = "";}, 2000);
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