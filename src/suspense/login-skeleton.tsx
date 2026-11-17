export function LoginSkeleton() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background animate-pulse">
      {/* Visual Photo Skeleton */}
      <div className="hidden lg:block lg:w-[58%] xl:w-[62%] 2xl:w-[65%] shrink-0 bg-muted/60" />

      {/* Form Container Skeleton */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 w-full min-h-screen">
        <div className="max-w-[420px] mx-auto w-full">
          <div className="w-24 h-8 rounded-full bg-muted/60" />
        </div>

        <div className="my-auto py-6 w-full max-w-[420px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="w-40 h-8 rounded-xl bg-muted/70" />
            <div className="w-64 h-4 rounded-lg bg-muted/50" />
          </div>

          <div className="w-full h-11 rounded-2xl bg-muted/60" />

          <div className="w-full h-px bg-border my-6" />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="w-20 h-4 rounded-md bg-muted/50" />
              <div className="w-full h-11 rounded-2xl bg-muted/60" />
            </div>

            <div className="space-y-2">
              <div className="w-20 h-4 rounded-md bg-muted/50" />
              <div className="w-full h-11 rounded-2xl bg-muted/60" />
            </div>

            <div className="w-full h-12 rounded-2xl bg-muted/80 mt-4" />
          </div>
        </div>

        <div className="w-48 h-4 rounded-md bg-muted/40 mx-auto" />
      </div>
    </div>
  );
}

export default LoginSkeleton;
