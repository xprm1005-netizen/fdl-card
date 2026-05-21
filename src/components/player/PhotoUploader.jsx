import { useState, useRef } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { C, radius } from '../../tokens';

function resizeImage(file, maxPx = 1500) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.92);
    };
    img.src = url;
  });
}

export default function PhotoUploader({ onFile, preview, label = '선수 사진 업로드' }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  async function handleFiles(files) {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const resized = await resizeImage(file);
    onFile(resized);
  }

  return (
    <div>
      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={preview} alt="선수 사진" style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: radius.lg, border: `2px solid ${C.gold}` }} />
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              position: 'absolute', bottom: 8, right: 8,
              background: C.gold, border: 'none',
              borderRadius: radius.md, padding: '6px 10px',
              color: C.bg, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            변경
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          style={{
            border: `2px dashed ${dragging ? C.gold : C.border}`,
            borderRadius: radius.lg,
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? C.goldSoft : 'transparent',
            transition: 'all 0.2s',
          }}
        >
          <ImageIcon size={40} color={C.gray} style={{ marginBottom: 12 }} />
          <div style={{ color: C.white, fontWeight: 600, marginBottom: 4 }}>{label}</div>
          <div style={{ color: C.sub, fontSize: 13 }}>클릭하거나 사진을 끌어다 놓으세요</div>
          <div style={{ color: C.gray, fontSize: 12, marginTop: 4 }}>JPG, PNG, HEIC (최대 10MB)</div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
