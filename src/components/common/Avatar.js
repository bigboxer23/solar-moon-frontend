import classNames from 'classnames';

export default function Avatar({ size = 'md', user }) {
  const sizeStyle = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }[size];

  const initials =
    user?.attributes?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('') || '';

  return (
    <div
      className={classNames(
        'Avatar bg-brand-primary rounded-full text-white flex text-center justify-center items-center text-xl font-bold tracking-wider',
        sizeStyle,
      )}
    >
      {initials}
    </div>
  );
}
