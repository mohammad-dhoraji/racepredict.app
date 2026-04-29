import { Skeleton } from "boneyard-js/react";

function AppSkeleton({
  name,
  loading,
  placeholder = null,
  fixture = placeholder,
  fallback = placeholder,
  animate = "pulse",
  transition = 300,
  className,
  children,
}) {
  return (
    <Skeleton
      name={name}
      loading={loading}
      fixture={fixture}
      fallback={fallback}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </Skeleton>
  );
}

export default AppSkeleton;
