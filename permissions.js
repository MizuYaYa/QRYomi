navigator.mediaDevices.getUserMedia({video: true,})
    .then(() => {
		console.log("カメラへのアクセスが許可されました。\nCamera access granted.");
	})
    .catch(e => {
		console.log(`カメラへのアクセスがブロックされました。\nCamera access blocked.\n${e}`);
	});