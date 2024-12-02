import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Skeleton} from "@nextui-org/react";

 interface OrdersTableSkeletonProps {
    skeletonColumns: string[];
 }

export default function OrdersTableSkeleton({skeletonColumns}:OrdersTableSkeletonProps) {
    return (
        <Table aria-label="Orders table loading" className="w-full">
            <TableHeader>
                {skeletonColumns.map((column, index) => (
                    <TableColumn key={index}>{column}</TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {Array.from({ length: skeletonColumns.length }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {skeletonColumns.map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton className="h-4 w-3/4 rounded-md" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}