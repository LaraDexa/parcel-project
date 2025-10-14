function SensorCard({ type, value, color }) {
  return (
    <div className="card shadow-sm" style={{ borderTop: `5px solid ${color}` }}>
      <div className="card-body text-center">
        <h5 className="card-title fw-bold">{type}</h5>
        <p className="card-text fs-4">{value}</p>
      </div>
    </div>
  );
}

export default SensorCard;
