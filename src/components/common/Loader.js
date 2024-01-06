const Loader = ({ loading, deviceCount, content }) => {
  return loading ? (
    <div className='w-100 loading'></div>
  ) : deviceCount === 0 && content !== '' ? (
    <div className='d-flex justify-content-start grow-1 flex-wrap'>
      {content}
    </div>
  ) : (
    ''
  );
};
export default Loader;
