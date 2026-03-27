export default function ProfileHeader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "16px 8px"
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "#ec4899",
          border: "3px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "13px"
        }}
      >
        👁
      </div>

      <span
        style={{
          fontWeight: "600",
          fontSize: "18px",
        color: "black"
        }}
      >
        Renda<span style={{ color: "#ec4899" }}>Visível</span>
      </span>
    </div>
  );
}