navigator.mediaDevices.getUserMedia({video: true,})
    .then(stream => {
		console.log("カメラへのアクセスが許可されました。\nCamera access granted.");
		stream.getTracks().forEach(track => track.stop());
	})
    .catch(e => {
		console.log(`カメラへのアクセスがブロックされました。\nCamera access blocked.\n${e}`);
	});