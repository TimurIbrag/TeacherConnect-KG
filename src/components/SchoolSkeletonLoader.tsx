
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SchoolSkeletonLoader: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="flex-1">
              <Skeleton className="h-6 w-4/5 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex justify-between mt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolSkeletonLoader;
