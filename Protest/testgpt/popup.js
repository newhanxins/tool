document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const errorMsg = document.getElementById('error-msg');
    document.getElementById('format-btn').onclick = function () {
        try {
            const obj = JSON.parse(input.value);
            output.textContent = JSON.stringify(obj, null, 2);
            errorMsg.textContent = '';
        } catch (e) {
            output.textContent = '';
            errorMsg.textContent = 'JSON 格式错误: ' + e.message;
        }
    };
    document.getElementById('copy-btn').onclick = function () {
        if (output.textContent) {
            navigator.clipboard.writeText(output.textContent);
            errorMsg.textContent = '已复制到剪贴板';
        } else {
            errorMsg.textContent = '无可复制内容';
        }
    };
    document.getElementById('fix-btn').onclick = function () {
        try {
            // 尝试修复常见错误：去除末尾逗号、替换中文引号等
            let text = input.value
                .replace(/，/g, ',')
                .replace(/“|”/g, '"')
                .replace(/\,\s*}/g, '}')
                .replace(/\,\s*]/g, ']');
            const obj = JSON.parse(text);
            output.textContent = JSON.stringify(obj, null, 2);
            errorMsg.textContent = '已自动修复并格式化';
        } catch (e) {
            output.textContent = '';
            errorMsg.textContent = '无法自动修复: ' + e.message;
        }
    };
});
