navigator.mediaDevices.getUserMedia({video: true}).then(() => {
		console.log("カメラへのアクセスが許可されました。\nCamera access granted.");
		alert("カメラへのアクセスが許可されました！\nこのページを閉じてQRコードを読み込みましょう！")
}).catch(e => {
		console.log(`カメラへのアクセスがブロックされました。\nCamera access blocked.\n${e}`);
		alert("カメラへのアクセスがブロックされました。\nchrome側のサイトの設定からカメラの権限を許可してください。")
});