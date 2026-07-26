export interface DashboardDto {
    todayOrders: number;
    pendingOrders: number;
    completedOrders: number;
    todayRevenue: number;
    availableProducts: number;
    lowStockCount: number;

    orderStatus: OrderStatusDto[];
    revenueChart: RevenueChartDto[];
    recentOrders: RecentOrderDto[];
    lowStockItems: LowStockDto[];
}

export interface OrderStatusDto {
    status: string;
    count: number;
}

export interface RevenueChartDto {
    label: string;
    revenue: number;
}

export interface RecentOrderDto {
    orderId: number;
    customerName: string;
    amount: number;
    status: string;
    orderDate: Date;
}

export interface LowStockDto {
    inventoryId: number;
    itemName: string;
    currentQuantity: number;
    reorderLevel: number;
}