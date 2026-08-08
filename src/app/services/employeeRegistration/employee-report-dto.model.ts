export interface EmployeeReportDto {
    employeeId: number;
    employeeName: string;
    email: string;
    roleName: string;
    phone: string;
    status: string; // 'Active' | 'Pending Login'
    joinDate: Date | string;
}