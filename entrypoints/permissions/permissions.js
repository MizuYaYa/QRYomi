const cam_permission_desc = document.getElementById("cam_permission_desc");

//言語ファイルに格納されている文字列を取得
function getMessage(msg) {
  const getMsg = chrome.i18n.getMessage(msg);
  console.log(`msg: "${msg}" \ngetMsg: "${getMsg}"`);
  return getMsg;
}

//cam_permission_descに「QRコードを読み込むには、カメラのアクセス許可が必要です。左上の「許可する」をクリックしてください。」を表示させる
cam_permission_desc.innerText = getMessage("permissions_cam_access_permission");

document.title = getMessage("permissions_title");

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(() => {
    console.log("カメラへのアクセスが許可されました。\nCamera access granted.");
    alert(getMessage("permissions_cam_access_granted"));
  })
  .catch((e) => {
    console.log(`カメラへのアクセスがブロックされました。\nCamera access blocked.\n${e}`);
    alert(getMessage("permissions_cam_access_blocked"));
  });
