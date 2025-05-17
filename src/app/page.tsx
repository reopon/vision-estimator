"use client";

import { useState, useEffect } from "react";

export default function Home() {
  


  const [rightSphere, setRightSphere] = useState("0.00");
  const [rightCylinder, setRightCylinder] = useState("0.00");
  const [leftSphere, setLeftSphere] = useState("0.00");
  const [leftCylinder, setLeftCylinder] = useState("0.00");
  const [result, setResult] = useState("");
  const [link, setLink] = useState("");
  const [showGlossary, setShowGlossary] = useState(false);
  const [viewOnlyResult, setViewOnlyResult] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const rs = searchParams.get("rs");
    const rc = searchParams.get("rc");
    const ls = searchParams.get("ls");
    const lc = searchParams.get("lc");
    if (rs && rc && ls && lc) {
      setRightSphere(rs);
      setRightCylinder(rc);
      setLeftSphere(ls);
      setLeftCylinder(lc);
      calculateVision(rs, rc, ls, lc);
      setViewOnlyResult(true);
    }
  }, []);

  const calculateVision = (
    rs = rightSphere,
    rc = rightCylinder,
    ls = leftSphere,
    lc = leftCylinder
  ) => {
    const sR = parseFloat(rs);
    const cR = parseFloat(rc);
    const sL = parseFloat(ls);
    const cL = parseFloat(lc);

    if (isNaN(sR) || isNaN(cR) || isNaN(sL) || isNaN(cL)) {
      setResult("すべての数値を正しく入力してください。\n（例: -0.75）\n 入力範囲の目安:\n  球面度数 -20.00 〜 +10.00 \n 乱視度数 0.00 〜 -6.00");
      return;
    }

    const calcSE = (s: number, c: number) => s + c / 2;
    const seR = calcSE(sR, cR);
    const seL = calcSE(sL, cL);

    const estimateVision = (se: number) => {
      if (se >= -0.5) return "0.8〜1.0";
      else if (se >= -1.0) return "0.4〜0.6";
      else if (se >= -1.5) return "0.2〜0.4";
      else if (se >= -2.0) return "0.1〜0.2";
      else return "0.1未満";
    };

    const visionR = estimateVision(seR);
    const visionL = estimateVision(seL);

    setResult(
      `右目\n等価球面度数（SE）: ${seR.toFixed(2)}D\n推定裸眼視力: ${visionR}\n\n左目\n等価球面度数（SE）: ${seL.toFixed(2)}D\n推定裸眼視力: ${visionL}`
    );

    const query = `?rs=${rs}&rc=${rc}&ls=${ls}&lc=${lc}`;
    setLink(`${window.location.origin}/${query}`);
  };

  const generateRange = (start: number, end: number, step: number) => {
    const values: string[] = [];
    for (let v = start; v <= end; v += step) {
      values.push(v.toFixed(2));
    }
    return values;
  };

  const sphereOptions = generateRange(-20, 10, 0.25);
  const cylinderOptions = generateRange(-6, 0, 0.25);

  return (
    <main className="bg-white text-black max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">視力推定ツール</h1>

      <div className="text-right">
        <button
          onClick={() => setShowGlossary(true)}
          className="text-sm text-blue-600 underline"
        >
          用語解説を見る
        </button>
      </div>

      {showGlossary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-sm space-y-4">
            <h2 className="text-lg font-semibold">用語解説</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>球面度数（S）</strong>：近視や遠視の度合いを示す数値。マイナスは近視、プラスは遠視。</li>
              <li><strong>乱視度数（C）</strong>：角膜や水晶体のゆがみによる乱視の強さ。0に近いほど乱視が少ない。</li>
              <li><strong>等価球面度数（SE）</strong>：球面度数と乱視度数から算出される総合的な度数。S + (C ÷ 2) で計算。視力の評価やメガネの度数決定に用いられる。</li>
              <li><strong>推定裸眼視力</strong>：SEから目安として推定される裸眼の視力。あくまで簡易的な指標です。</li>
            </ul>
            <div className="text-right">
              <button onClick={() => setShowGlossary(false)} className="mt-4 text-blue-600 underline">閉じる</button>
            </div>
          </div>
        </div>
      )}

      {!viewOnlyResult && (
        <>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">右目</h2>
            <label>球面度数（S）</label>
            <select value={rightSphere} onChange={(e) => setRightSphere(e.target.value)} className="border rounded p-1 w-full">
              {sphereOptions.map((val) => <option key={val} value={val}>{val}</option>)}
            </select>
            <label>乱視度数（C）</label>
            <select value={rightCylinder} onChange={(e) => setRightCylinder(e.target.value)} className="border rounded p-1 w-full">
              {cylinderOptions.map((val) => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">左目</h2>
            <label>球面度数（S）</label>
            <select value={leftSphere} onChange={(e) => setLeftSphere(e.target.value)} className="border rounded p-1 w-full">
              {sphereOptions.map((val) => <option key={val} value={val}>{val}</option>)}
            </select>
            <label>乱視度数（C）</label>
            <select value={leftCylinder} onChange={(e) => setLeftCylinder(e.target.value)} className="border rounded p-1 w-full">
              {cylinderOptions.map((val) => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => calculateVision()}
          >
            計算する
          </button>
        </>
      )}

      {result && (
        <>
          <pre className="bg-gray-100 text-black p-3 rounded whitespace-pre-wrap text-sm">{result}</pre>
          <div className="text-sm mt-2">
            共有リンク: <a href={link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{link}</a>
          </div>
          {viewOnlyResult && (
            <div className="mt-4 text-center">
              <button onClick={() => setViewOnlyResult(false)} className="text-blue-600 underline text-sm">もう一回測定する</button>
            </div>
          )}
        </>
      )}

      <div className="pt-6 text-sm text-gray-700">
        <h3 className="font-semibold">球面度数（S）の目安</h3>
        <ul className="list-disc list-inside">
          <li>正常視：0.00D</li>
          <li>軽度近視：-0.25D 〜 -2.00D</li>
          <li>中等度近視：-2.25D 〜 -5.00D</li>
          <li>強度近視：-5.25D 以下</li>
          <li>軽度遠視：+0.25D 〜 +2.00D</li>
          <li>強度遠視：+2.25D 以上</li>
        </ul>
        <h3 className="font-semibold pt-4">乱視度数（C）の目安</h3>
        <ul className="list-disc list-inside">
          <li>軽度乱視：-0.25D 〜 -1.00D</li>
          <li>中等度乱視：-1.25D 〜 -2.00D</li>
          <li>強度乱視：-2.25D 以下</li>
        </ul>
      </div>
    </main>
  );
}

