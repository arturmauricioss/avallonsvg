document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("svgCodeTextarea");

  // Inicializa o CodeMirror na textarea
  const editor = CodeMirror.fromTextArea(textarea, {
    mode: "xml",
    lineNumbers: true,
    theme: "default", // Você pode mudar o tema se desejar
    lineWrapping: true, // Permite quebra de linha
  });

  const svgPreview = document.getElementById("svgPreview");
  const fileInput = document.createElement("input");

  // Função para atualizar o preview com o código SVG
  function updatePreview(svgCode) {
    svgPreview.innerHTML = "";
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.innerHTML = svgCode;
    svgPreview.appendChild(svgElement);
  }

  // Evento de input no CodeMirror
  editor.on("change", function () {
    const svgCode = editor.getValue();
    updatePreview(svgCode);
  });

  // Evento de clique no campo de preview para carregar arquivo SVG
  svgPreview.addEventListener("click", function () {
    fileInput.type = "file";
    fileInput.accept = ".svg";

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function () {
        const svgCode = reader.result;
        editor.setValue(svgCode);
        updatePreview(svgCode);
      };

      reader.readAsText(file);
    });

    fileInput.click();
  });

  // Evento de clique no botão para compilar SVG
  document.getElementById("botaosvg").addEventListener("click", function () {
    const svgCode = editor.getValue();
    const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("download", "generated-image.svg");
    a.setAttribute("href", url);
    a.click();

    URL.revokeObjectURL(url);
  });

  // Evento de clique no botão para baixar PNG
  document.getElementById("botaopng").addEventListener("click", function () {
    const svgCode = editor.getValue();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const tempSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    tempSvg.innerHTML = svgCode;
    document.body.appendChild(tempSvg);

    const bbox = tempSvg.getBBox();
    canvas.width = bbox.width;
    canvas.height = bbox.height;

    context.clearRect(0, 0, canvas.width, canvas.height);

    function renderSVGToCanvas(svg, canvas) {
      return new Promise((resolve, reject) => {
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = function () {
          context.drawImage(img, 0, 0);
          resolve(canvas);
        };
        img.onerror = reject;
        img.src =
          "data:image/svg+xml;base64," +
          btoa(unescape(encodeURIComponent(svgData)));
      });
    }

    renderSVGToCanvas(tempSvg, canvas).then(() => {
      const dataURL = canvas.toDataURL("image/png");
      document.body.removeChild(tempSvg);

      const a = document.createElement("a");
      a.setAttribute("download", "generated-image.png");
      a.setAttribute("href", dataURL);
      a.click();
    });
  });

  // Evento de clique no código SVG para copiar para a área de transferência
  const codeContainer = document.querySelector(".code-container");

  codeContainer.addEventListener("click", function (event) {
    event.preventDefault(); // Evita comportamentos padrão de eventos

    const codeText = event.currentTarget
      .querySelector(".code-inner code")
      .textContent.trim(); // Obtém o texto do código
    navigator.clipboard
      .writeText(codeText)
      .then(function () {
        alert("Código copiado para a área de transferência!");
      })
      .catch(function (err) {
        console.error("Erro ao copiar texto: ", err);
      });
  });

  codeContainer.addEventListener("touchstart", function (event) {
    event.preventDefault(); // Evita comportamentos padrão de eventos

    const codeText = event.currentTarget
      .querySelector(".code-inner code")
      .textContent.trim(); // Obtém o texto do código
    navigator.clipboard
      .writeText(codeText)
      .then(function () {
        alert("Código copiado para a área de transferência!");
      })
      .catch(function (err) {
        console.error("Erro ao copiar texto: ", err);
      });
  });
});