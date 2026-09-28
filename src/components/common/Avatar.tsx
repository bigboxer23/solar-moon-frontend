import classNames from 'classnames';
import type { ReactElement } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  size?: AvatarSize;
  attributes?: {
    name?: string;
  };
}

export default function Avatar({
  size = 'md',
  attributes,
}: AvatarProps): ReactElement {
  const sizeStyle: Record<AvatarSize, string> = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const initials =
    attributes?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('') ?? '';

  return (
    <div
      className={classNames(
        'Avatar flex items-center justify-center rounded-full bg-brand-primary text-center text-xl font-bold tracking-wider text-white',
        sizeStyle[size],
      )}
    >
      {initials}
    </div>
  );
}
