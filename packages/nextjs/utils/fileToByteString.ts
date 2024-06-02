export function fileToByteString(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const arrayBuffer = event?.target?.result;
      // @ts-ignore
      const byteArray = new Uint8Array(arrayBuffer);
      let byteString = "";

      for (let i = 0; i < byteArray.length; i++) {
        byteString += String.fromCharCode(byteArray[i]);
      }

      resolve(byteString);
    };

    reader.onerror = function () {
      reject(new Error("Error reading file"));
    };

    reader.readAsArrayBuffer(file);
  });
}
