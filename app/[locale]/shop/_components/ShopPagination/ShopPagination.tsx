import Pagination from "@/components/Pagination/Pagination";
import { toShopSearch, type ProductListQuery } from "@/lib/storefront";

interface ShopPaginationProps {
    query: ProductListQuery;
    page: number;
    totalPages: number;
}

// Giữ nguyên bộ lọc hiện tại, chỉ đổi số trang
export default function ShopPagination({ query, page, totalPages }: ShopPaginationProps) {
    return (
        <Pagination
            page={page}
            totalPages={totalPages}
            hrefFor={(target) => `/shop${toShopSearch({ ...query, page: target })}`}
        />
    );
}
