import React from 'react';

export type EditorialContainerSize = 'wide' | 'narrow' | 'prose';

interface EditorialContainerProps {
  children: React.ReactNode;
  size?: EditorialContainerSize;
  as?: 'div' | 'section';
  className?: string;
}

const SIZE_CLASSES: Record<EditorialContainerSize, string> = {
  wide: 'container-editorial',
  narrow: 'container-editorial-narrow',
  prose: 'container-editorial-prose',
};

export const EditorialContainer: React.FC<EditorialContainerProps> = ({
  children,
  size = 'wide',
  as: Component = 'div',
  className = '',
}) => {
  const baseClass = SIZE_CLASSES[size];
  const mergedClass = className ? `${baseClass} ${className}` : baseClass;
  return <Component className={mergedClass}>{children}</Component>;
};
