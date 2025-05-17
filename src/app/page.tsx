"use client";

import { useState, useEffect, useMemo } from "react";

export default function Home() {
  const [rightSphere, setRightSphere] = useState("0.00");
  const [rightCylinder, setRightCylinder] = useState("0.00");
  const [leftSphere, setLeftSphere] = useState("0.00");
  const [leftCylinder, setLeftCylinder] = useState("0.00");
  const [rightAxis, setRightAxis] = useState("0");
  const [leftAxis, setLeftAxis] = useState("0");
  const [result, setResult] = useState("");
  const [link, setLink] = useState("");
  const [showModal, setShowModal] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const rs = params.get("rs");
    const rc = params.get("rc");
    const ls = params.get("ls");
    const lc = params.get("lc");
    if (rs && rc && ls && lc) {
      setRightSphere(rs);
      setRightCylinder(rc);
      setLeftSphere(ls);
      setLeftCylinder(lc);
      calculateVision(rs, rc, ls, lc);
    }
  }, []);

  const generateRange = (start: number, end: number, step: number) => {
    const values: string[] = [];
    for (let v = start; v <= end; v += step) {
      values.push(v.toFixed(2));
    }
    return values;
  };

  const sphereOptions = useMemo(() => generateRange(-20, 10, 0.25), []);
  const cylinderOptions = useMemo(() => generateRange(-6, 0, 0.25), []);
  const axisOptions = ["0", "45", "90", "135", "180"];

  const calcSE = (s: number, c: number) => s + c / 2;
  const estimateVision = (se: number) => {
    if (se >= -0.25) return "1.0〜1.5以上";
    else if (se >= -0.50) return "0.8〜1.0";
    else if (se >= -0.75) return "0.6〜0.8";
    else if (se >= -1.00) return "0.5〜0.7";
    else if (se >= -1.50) return "0.3〜0.5";
    else if (se >= -2.00) return "0.2〜0.3";
    else if (se >= -3.00) return "0.1〜0.2";
    else return "0.1未満";
  };

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
    const seR = calcSE(sR, cR);
    const seL = calcSE(sL, cL);
    const visionR = estimateVision(seR);
    const visionL = estimateVision(seL);
    setResult(
      `右目\n等価球面度数（SE）: ${seR.toFixed(2)}D\n推定裸眼視力: ${visionR}\n左目\n等価球面度数（SE）: ${seL.toFixed(2)}D\n推定裸眼視力: ${visionL}\n\n※目安です。乱視が強い場合や目の状態によって、実際の視力はこれより低くなることがあります。`
    );
    const query = `?rs=${rs}&rc=${rc}&ls=${ls}&lc=${lc}`;
    if (typeof window !== "undefined") {
      setLink(`${window.location.protocol}//${window.location.host}/${query}`);
    }
  };

  return (
    <main className="bg-white text-black max-w-md mx-auto p-4 space-y-4">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full text-sm">
            <h2 className="text-lg font-semibold mb-2">{showModal.title}</h2>
            <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: showModal.content }} />
            <div className="text-right">
              <button onClick={() => setShowModal(null)} className="mt-4 text-blue-600 underline">閉じる</button>
            </div>
          </div>
        </div>
      )}

      {["右", "左"].map((side, i) => (
        <div className="space-y-4" key={side}>
          <h2 className="text-lg font-semibold">{side}目</h2>
          <label className="block">
            球面度数（S）
            <button
              type="button"
              onClick={() => setShowModal({ title: "球面度数（S）", content: `近視や遠視の度合いを示す数値。マイナスは近視、プラスは遠視。<br /><br />目安：<ul class='list-disc list-inside pl-0 space-y-0.5'><li>正常視：0.00D</li><li>軽度近視：-0.25D 〜 -2.00D</li><li>中等度近視：-2.25D 〜 -5.00D</li><li>強度近視：-5.25D 以下</li><li>軽度遠視：+0.25D 〜 +2.00D</li><li>強度遠視：+2.25D 以上</li></ul>` })}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <span className="inline-block w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs leading-5 text-center">？</span>
            </button>
          </label>
          <select value={i === 0 ? rightSphere : leftSphere} onChange={(e) => i === 0 ? setRightSphere(e.target.value) : setLeftSphere(e.target.value)} className="border rounded p-1 w-full">
            {sphereOptions.map((val) => <option key={val}>{val}</option>)}
          </select>

          <label className="block">
            乱視度数（C）
            <button
              type="button"
              onClick={() => setShowModal({ title: "乱視度数（C）", content: `角膜や水晶体のゆがみによる乱視の強さ。0に近いほど乱視が少ない。<br /><br />目安：<ul class='list-disc list-inside pl-0'><li>軽度乱視：-0.25D 〜 -1.00D</li><li>中等度乱視：-1.25D 〜 -2.00D</li><li>強度乱視：-2.25D 以下</li></ul>` })}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <span className="inline-block w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs leading-5 text-center">？</span>
            </button>
          </label>
          <select value={i === 0 ? rightCylinder : leftCylinder} onChange={(e) => i === 0 ? setRightCylinder(e.target.value) : setLeftCylinder(e.target.value)} className="border rounded p-1 w-full">
            {cylinderOptions.map((val) => <option key={val}>{val}</option>)}
          </select>

          <label className="block">
            乱視の軸（AXIS）
            <button
              type="button"
              onClick={() => setShowModal({
                title: "乱視の軸（AXIS）",
                content: `乱視の方向を表す角度（0〜180度）。矯正レンズでどの方向に乱視を補正するかを示します。<br /><br /><strong>分類の目安：</strong><ul class='list-disc list-inside pl-0'><li><strong>直乱視</strong>：軸が90°付近。横方向にブレが生じやすい（例：「V」が「W」に見える）。</li><li><strong>倒乱視</strong>：軸が180°付近。縦方向にブレが生じやすい（例：「一」が「二」に見える）。</li><li><strong>斜乱視</strong>：軸が45°や135°など、斜め方向に乱視がある。</li></ul>`
              })}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <span className="inline-block w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs leading-5 text-center">？</span>
            </button>
          </label>
          <select value={i === 0 ? rightAxis : leftAxis} onChange={(e) => i === 0 ? setRightAxis(e.target.value) : setLeftAxis(e.target.value)} className="border rounded p-1 w-full">
            {axisOptions.map((val) => <option key={val}>{val}</option>)}
          </select>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => calculateVision()}
      >
        推定視力を算出する
      </button>

      {result && (
        <div className="relative">
  <pre className="bg-gray-100 text-black p-3 rounded whitespace-pre-wrap text-sm">
    {result.split('\n').map((line, idx) => {
      if (line.startsWith("推定裸眼視力")) {
        return <div key={idx} className="text-blue-700 font-bold text-base">{line}</div>;
      }
      return <div key={idx}>{line}</div>;
    })}
  </pre>
  <button
    type="button"
    onClick={() => setShowModal({
      title: "等価球面度数・推定裸眼視力の説明",
      content: `<strong>等価球面度数（SE）</strong>：球面度数と乱視度数から計算される総合的な度数（S + C ÷ 2）です。<br/><br/>
<strong>推定裸眼視力</strong>：等価球面度数（SE）に基づいておおよその視力を予測したものです。あくまで目安です。<br/><br/>
<strong>対応表：</strong>
<table class='w-full text-sm divide-y divide-gray-200'>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>0.00 ～ -0.25</td>
    <td class='py-1.5 pl-4'>1.0〜1.5以上</td>
  </tr>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>-0.50</td>
    <td class='py-1.5 pl-4'>0.8〜1.0</td>
  </tr>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>-0.75</td>
    <td class='py-1.5 pl-4'>0.6〜0.8</td>
  </tr>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>-1.00</td>
    <td class='py-1.5 pl-4'>0.5〜0.7</td>
  </tr>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>-1.50</td>
    <td class='py-1.5 pl-4'>0.3〜0.5</td>
  </tr>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>-2.00</td>
    <td class='py-1.5 pl-4'>0.2〜0.3</td>
  </tr>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>-3.00</td>
    <td class='py-1.5 pl-4'>0.1〜0.2</td>
  </tr>
  <tr class='divide-x divide-gray-200'>
    <td class='py-1.5 pr-4'>-4.00以下</td>
    <td class='py-1.5 pl-4'>0.1未満</td>
  </tr>
</table>
※「乱視の軸」は何の計算にも使っていません。すみません`
    })}
    className="absolute top-0 right-0 mt-1 mr-2 text-blue-600 hover:text-blue-800"
  >
    <span className="inline-block w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs leading-5 text-center">？</span>
  </button>
</div>
      )}

      {link && (
        <div className="text-sm text-gray-600 break-all">
          結果URL: <a href={link} className="text-blue-600 underline">{link}</a>
        </div>
      )}
    </main>
  );
}
