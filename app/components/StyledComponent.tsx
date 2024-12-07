"use client";

export default function StyledComponent() {
  return (
    <div>
      <p>Ini adalah komponen dengan styled-jsx.</p>
      <style jsx>{`
        p {
          color: blue;
        }
      `}</style>
    </div>
  );
}
