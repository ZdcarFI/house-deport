import {Button, Skeleton} from "@nextui-org/react";
import {Card} from "@nextui-org/card";

export default function OrderSkeletonPage() {
    return (
        <div className="container mx-auto p-4">
            <Skeleton className="h-8 w-2/5 rounded-lg mb-4">
                <div className="h-8 w-2/5 bg-default-300"></div>
            </Skeleton>

            <Card className="space-y-5 p-6">
                <Skeleton className="h-6 w-3/5 rounded-lg mb-4">
                    <div className="h-6 w-3/5 bg-default-300"></div>
                </Skeleton>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div className="space-y-3" key={i}>
                            <Skeleton className="h-4 w-4/5 rounded-lg">
                                <div className="h-4 w-4/5 bg-default-200"></div>
                            </Skeleton>
                            <Skeleton className="h-10 w-full rounded-lg">
                                <div className="h-10 w-full bg-default-300"></div>
                            </Skeleton>
                        </div>
                    ))}
                </div>

                <Skeleton className="h-6 w-3/5 rounded-lg mt-4">
                    <div className="h-6 w-3/5 bg-default-200"></div>
                </Skeleton>

                <div className="mt-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton className="h-10 w-full rounded-lg mb-2" key={i}>
                            <div className="h-10 w-full bg-default-300"></div>
                        </Skeleton>
                    ))}
                </div>

                <div className="flex flex-col justify-end gap-2 items-end mt-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton className="h-4 w-1/3 rounded-lg" key={i}>
                            <div className="h-4 w-1/3 bg-default-200"></div>
                        </Skeleton>
                    ))}
                </div>

                <Skeleton className="mt-4">
                    <Button disabled className="w-full">
                        Create Order
                    </Button>
                </Skeleton>
            </Card>
        </div>
    );
}