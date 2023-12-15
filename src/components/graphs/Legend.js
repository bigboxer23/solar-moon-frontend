const Legend = ({ colorData }) => {
  return (
    <div className='d-flex flex-wrap '>
      {colorData
        .sort((d1, d2) => d1.name.localeCompare(d2.name))
        .map((d) => {
          return (
            <div className='d-flex align-items-center p-2' key={d.name}>
              <div
                className='colorDot me-1'
                style={{ backgroundColor: d.color }}
              />
              {d.name}
            </div>
          );
        })}
    </div>
  );
};
export default Legend;
