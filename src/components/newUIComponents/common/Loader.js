export default function Loader({ className }) {
  return (
    <div className={className + ' Loader'}>
      <div className='loader-ellipsis'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
