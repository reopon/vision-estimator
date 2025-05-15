"use client";

import { useState } from "react";

export default function Home() {
  const [rightSphere, setRightSphere] = useState("-0.50");
  const [rightCylinder, setRightCylinder] = useState("-2.00");
  const [leftSphere, setLeftSphere] = useState("-0.75");
  const [leftCylinder, setLeftCylinder] = useState("-1.75");
  const [result, setResult] = useState("");

  const calculateVision = () => {
    const sR = parseFloat(rightSphere);
    const cR = parseFloat(rightCylinder);
    const sL = parseFloat(leftSphere);
    const cL = parseFloat(leftCylinder);

    if (isNaN(sR) || isNaN(cR) || isNaN(sL) || isNaN(cL)) {
      setResult("すべての数値を正しく入力してください。\n（例: -0.75 や -1.75）\n入力範囲の目安: 球面度数 -20.00 〜 +10.00、乱視度数 0.00 〜 -6.00");
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
  };

  const sphereOptions = ["0.00", "-0.50", "-0.75", "-1.00", "-1.50", "-2.00", "-3.00", "-5.00", "-10.00"];
  const cylinderOptions = ["0.00", "-0.25", "-0.75", "-1.00", "-1.75", "-2.00", "-3.00", "-5.00"];

  const renderDatalist = (id: string, options: string[]) => (
    <datalist id={id}>
      {options.map((val) => (
        <option key={val} value={val} />
      ))}
    </datalist>
  );

  return (
    <main className="bg-white text-black max-w-md mx-auto p-4 space-y-4">

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">右目</h2>
        <label>球面度数（S）</label>
        <input
          list="sphereOptions"
          value={rightSphere}
          onChange={(e) => setRightSphere(e.target.value)}
          className="border rounded p-1 w-full"
        />
        <label>乱視度数（C）</label>
        <input
          list="cylinderOptions"
          value={rightCylinder}
          onChange={(e) => setRightCylinder(e.target.value)}
          className="border rounded p-1 w-full"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">左目</h2>
        <label>球面度数（S）</label>
        <input
          list="sphereOptions"
          value={leftSphere}
          onChange={(e) => setLeftSphere(e.target.value)}
          className="border rounded p-1 w-full"
        />
        <label>乱視度数（C）</label>
        <input
          list="cylinderOptions"
          value={leftCylinder}
          onChange={(e) => setLeftCylinder(e.target.value)}
          className="border rounded p-1 w-full"
        />
      </div>

      {renderDatalist("sphereOptions", sphereOptions)}
      {renderDatalist("cylinderOptions", cylinderOptions)}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={calculateVision}
      >
        計算する
      </button>

      {result && (
       <pre className="bg-gray-100 text-black p-3 rounded whitespace-pre-wrap text-sm">{result}</pre>
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
