import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>NORTA - テストページ</h1>
      <p>この画面が表示されれば、基本的なReactアプリケーションは動作しています。</p>
      <div style={{ marginTop: '20px' }}>
        <h3>技術スタック:</h3>
        <ul>
          <li>React 18</li>
          <li>TypeScript</li>
          <li>Vite</li>
          <li>Redux Toolkit</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px', padding: '10px', background: '#333', borderRadius: '5px' }}>
        <h4>デモモード</h4>
        <p>Firebase設定が不完全な場合、デモモードで動作します。</p>
        <p>実際の機能を使用するには、.envファイルを設定してください。</p>
      </div>
    </div>
  );
};

export default TestPage;
