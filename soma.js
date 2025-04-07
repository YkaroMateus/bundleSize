const fs = require("fs");

function extractCompressionValues(textArray) {
  return textArray
    .map((text) => {
      let match = text.match(/(brotliCompress|tiny|gzip):\s*(\d+\.\d+)kb/);
      if (match) {
        return { type: match[1], size: parseFloat(match[2]) };
      }

      match = text.match(/(\d+\.\d+)kb/);
      if (match) {
        return { type: "KB", size: parseFloat(match[1]) };
      }
      return null;
    })
    .filter((value) => value !== null);
}

function readBundleListFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const lines = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    return extractCompressionValues(lines);
  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
    return [];
  }
}
const compressType = {
  brotliCompress: "Brotli",
  gzip: "Gzip",
  tiny: "Tiny",
  KB: "KB",
};

const filePath = "bundle-list.txt";
const valores = readBundleListFile(filePath);

const somaPorTipo = valores.reduce((acc, { type, size }) => {
  acc[type] = (acc[type] || 0) + size;
  return acc;
}, {});

Object.entries(somaPorTipo).forEach(([type, size], index) => {
  console.log(
    `${index == 0 ? "\n" : ""}Soma total em KB com ${
      compressType[type]
    }: ${size.toFixed(3)} kb`
  );
  console.log(
    `Soma total em MB com ${compressType[type]}: ${(size.toFixed(3) / 1024)
      .toFixed(2)
      .replace(".", ",")} mb\n`
  );
});
