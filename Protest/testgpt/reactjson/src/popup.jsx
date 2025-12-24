import React, { useState } from 'react';

const Popup = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError('');
    } catch (e) {
      setOutput('');
      setError('JSON 格式错误: ' + e.message);
    }
  };

  const copyJson = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setError('已复制到剪贴板');
    } else {
      setError('无可复制内容');
    }
  };

  const fixJson = () => {
    try {
      let text = input
        .replace(/，/g, ',')
        .replace(/“|”/g, '"')
        .replace(/\,\s*}/g, '}')
        .replace(/\,\s*]/g, ']');
      const obj = JSON.parse(text);
      setOutput(JSON.stringify(obj, null, 2));
      setError('已自动修复并格式化');
    } catch (e) {
      setOutput('');
      setError('无法自动修复: ' + e.message);
    }
  };

  return (
    <div className="container">
      <h2>JSON 格式化与修复</h2>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="粘贴或输入 JSON..."
        rows={10}
      />
      <div className="btn-group">
        <button onClick={formatJson}>格式化</button>
        <button onClick={copyJson}>复制</button>
        <button onClick={fixJson}>修复错误</button>
      </div>
      <div className="error">{error}</div>
      <pre>{output}</pre>
    </div>
  );
};

export default Popup;

// 挂载到 root
import { createRoot } from 'react-dom/client';
const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Popup />);
}
