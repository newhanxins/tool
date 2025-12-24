const container = document.getElementById("jsoneditor");
const errorMsg = document.getElementById("errorMsg");
const input = document.getElementById("input");

const options = {
  modes: ["code", "form", "tree"],
  onChangeText(text) {
    try {
      const json = JSON.parse(text);
      input.value = JSON.stringify(json, null, 4);
    } catch (e) {}
  },
  showErrorTable: true,
};

const editor = new JSONEditor(container, options, "");

input.addEventListener("input", (event) => {
  const text = event.target.value;
  if (!text) {
    editor.set();
    editor.container.className = "target";
    return;
  }
  try {
    const json = JSON.parse(text);
    editor.set(json);
    editor.container.className = "target";
  } catch (e) {
    editor.set(e.message);
    editor.container.className = "target error-status";
  }
});
